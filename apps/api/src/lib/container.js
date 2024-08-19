import {
  createContainer,
  Lifetime,
  InjectionMode,
  asValue,
  asFunction,
} from 'awilix';
import { logger } from './logger';
import mongoose from 'mongoose';
import path from 'path';
import AWS from 'aws-sdk';

/**
 * Using Awilix, the following files and folders (glob patterns)
 * will be loaded.
 */
const modulesToLoad = [
  // Services should be scoped to the request.
  // This means that each request gets a separate instance
  // of a service.
  ['services/*.js', Lifetime.SCOPED],
  // Stores will be singleton (1 instance per process).
  // This is just for demo purposes, you can do whatever you want.
  ['stores/*.js', Lifetime.SINGLETON],
];

/**
 * Configures a new container.
 *
 * @return {Object} The container.
 */
export function configureContainer() {
  const opts = {
    // Classic means Awilix will look at function parameter
    // names rather than passing a Proxy.
    injectionMode: InjectionMode.PROXY,
  };
  return createContainer(opts)
    .loadModules(modulesToLoad, {
      // `modulesToLoad` paths should be relative
      // to this file's parent directory.
      cwd: `${__dirname}/../`,
      // Example: registers `services/todo-service.js` as `todoService`
      formatName: 'camelCase',
    })
    .register({
      // Our logger is already constructed,
      // so provide it as-is to anyone who wants it.
      acceptedLanguages: asValue(['fr', 'en']),
      logger: asFunction(() => logger),
      emailTemplateConfig: asFunction(() => {
        return {
          views: {
            root: path.join(__dirname, 'templates', 'emails'),
          },
        };
      }),
      sqs: asFunction(() => {
        return new AWS.SQS();
      }).singleton(),
      s3: asFunction(() => {
        return new AWS.S3();
      }).singleton(),
      // natsUri: asValue(
      //   `nats://${process.env.NATS_OPTS_HOST || 'localhost'}:${process.env
      //     .NATS_OPTS_PORT || 4222}`
      // ),
      // nats: asFunction(() => {
      //   return NATS.connect({
      //     url: process.env.NATS_OPTS_URL,
      //     json: true
      //   })
      // })
      //   .singleton()
      //   .disposer(nc => nc.close()),
      db:
        // Whenever we first request a `mongoose`, create a connection.
        asFunction(() => {
          return mongoose.connection;
        })
          // Make sure we only have 1 connection per process.
          // (the connection is reused)
          // Whenever we use `container.dispose()`, close the connection.
          .singleton()
          .disposer((conn) => conn.close()),
      defaultPaginateOptions: asFunction(() => ({
        page: 1,
        lean: true,
        leanWithId: true,
        limit: process.env.PER_PAGE ? parseInt(process.env.PER_PAGE) : 25,
        customLabels: {
          totalDocs: 'itemCount',
          docs: 'results',
          limit: 'perPage',
          page: 'currentPage',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'pageCount',
        },
      })),
    });
}
