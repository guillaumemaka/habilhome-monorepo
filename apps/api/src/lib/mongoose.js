import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { logger } from './logger';

export function getConfiguration(mongoUri = null) {
  const uri = mongoUri || process.env.MONGO_URI;

  const options = {
    // connectTimeoutMS: 5000,
    // keepAlive: 1,
    // keepAliveInitialDelay: 300000,
    // socketTimeoutMS: 45000,
    family: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    promiseLibrary: bluebird.Promise,
    useFindAndModify: false,
  };

  if (process.env.MONGO_USER) {
    options.user = process.env.MONGO_USER;
  }

  if (process.env.MONGO_PASS) {
    options.pass = process.env.MONGO_PASS;
  }

  if (options.user) {
    options.auth = { authSource: 'admin' };
  }

  return { uri, options };
}
export function connect(config = {}) {
  const { uri, options } = { ...getConfiguration(), ...config };

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  return mongoose.connect(uri, options, (err) => {
    if (err) {
      logger.error(err.message, { error: err });
      setTimeout(async () => {
        await connect();
      }, 5000);
    }
  });
}

// connect();

export default mongoose.connection.db;
