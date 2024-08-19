import * as http from 'http';
import Koa from 'koa';
import cors from '@koa/cors';
import respond from 'koa-respond';
import bodyParser from 'koa-bodyparser';
import cookie from 'koa-cookie';
import compress from 'koa-compress';
import passport from 'koa-passport';
import { scopePerRequest, loadControllers } from 'awilix-koa';
import { logger } from './logger';
import { configureContainer } from './container';
import { notFoundHandler } from '../middleware/not-found';
import { errorHandler } from '../middleware/error-handler';
import { registerContext } from '../middleware/register-context';
import registerLanguage from '../middleware/locales';
import mongoose from 'mongoose';
import { connect } from './mongoose';
import { Promise } from 'bluebird';
import './auth';
import './aws';

const container = configureContainer();

/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Promise<http.Server>} The configured app.
 */
export async function createServer() {
  logger.debug('Creating server...');
  const app = new Koa();

  app.proxy = true;

  // Container is configured with our services and whatnot.
  app.container = container;

  app
    // Top middleware is the error handler.
    .use(errorHandler)
    // Compress all responses.
    .use(compress())
    // Adds ctx.ok(), ctx.notFound(), etc..
    .use(respond())
    // Handles CORS.
    .use(cors())
    // Parses request bodies.
    .use(bodyParser())
    // Cookie parser
    .use(cookie())
    // Creates an Awilix scope per request. Check out the awilix-koa
    // docs for details: https://github.com/jeffijoe/awilix-koa
    .use(scopePerRequest(container))
    // Passport middleware
    .use(passport.initialize())
    // Create a middleware to add request-specific data to the scope.
    .use(registerContext)
    // Language detection.
    .use(registerLanguage)
    // Load routes (API "controllers")
    .use(loadControllers('../routes/*.js', { cwd: __dirname }))
    // Default handler when nothing stopped the chain.
    .use(notFoundHandler);

  app.on('error', (err, ctx) => {
    logger.error(`Error ${ctx.method} ${ctx.url}`, { data: { err, ctx } });
  });

  const connection = mongoose.connection;

  connection.once('open', () => {
    logger.debug('MongoDB database connection established successfully!');
    const { startupService } = container.cradle;
    try {
      Promise.all([startupService.init()]);
    } catch (error) {
      logger.error(error.message, { error });
    }
  });

  connection.once('connecting', () => {
    logger.debug('MongoDB database connecting...!');
  });

  connection.on('reconnected', () => {
    logger.debug('MongoDB database reconnected successfully!');
  });

  connection.on('diconnected', () => {
    logger.debug('MongoDB database disconneted!');
  });

  connection.on('close', () => {
    logger.debug('MongoDB database connection closed!');
  });

  connection.on('error', async (err) => {
    logger.error(err.message);
    connect();
  });

  // Creates a http server ready to listen.
  const server = http.createServer(app.callback());

  const exitHandler = function (options = {}, exitCode = 0) {
    if (options.cleanup) {
      container.dispose();
    }

    if (options.exceptionThrown) {
      logger.error(options);
    }

    if (exitCode === 1) {
      server.close(() => process.exit(exitCode));
    }
  };

  // Add a `close` event listener so we can clean up resources.
  server.on('close', () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Closing MongoDB connection!');
    logger.debug('Disposing Awillix container!');
    container.dispose();
    logger.debug('Server closing, bye!');
  });

  // do something when app is closing
  process.on('exit', exitHandler);

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }, 1));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  // catches uncaught exceptions
  // process.on("uncaughtException", (err, origin) => {
  //   exitHandler({ err, origin, exceptionThrown: true }, 1);
  // });

  logger.debug('Server created, ready to listen', { scope: 'startup' });
  return server;
}
