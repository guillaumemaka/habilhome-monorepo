/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { createServer } from '../lib/server';
import { connect, getConfiguration } from '../lib/mongoose';
import { memoize } from 'lodash';
import st from 'supertest';
import mongoose from 'mongoose';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { configureContainer } from '../lib/container';
import { Promise } from 'bluebird';

AWSMock.Promise = Promise;
AWSMock.setSDKInstance(AWS);

export function createContainer(registrations = {}) {
  const container = configureContainer();
  container.register(registrations);
  return container;
}

export function awsMock(service, method, replace) {
  AWSMock.mock(service, method, replace);
}

export function awsMockRestore(service = null, method = null) {
  if (service && method) {
    AWSMock.restore(service, method);
  } else {
    AWSMock.restore();
  }
}

/**
 * API helper to make it easier to test endpoints.
 */
export async function apiHelper() {
  const app = await createServer();
  const server = await startServer();
  const request = st(server);
  return {
    catch: catchAndLog, // Useful for logging failing requests
    request,
    server,
    app,
  };
}

/**
 * Creates a status asserter that asserts the given status on the response,
 * then returns the response data.
 *
 * @param {number} status
 */
export function assertStatus(status) {
  return async function statusAsserter(resp) {
    if (resp.status !== status) {
      throw new Error(
        `Expected ${status} but got ${resp.status}: ${resp.error.method} ${resp.error.path}`
      );
    }
    return resp.body;
  };
}

function catchAndLog(err) {
  if (err.response) {
    console.error(
      `Error ${err.response.status} in request ${err.response.request.method} ${err.response.request.path}`,
      err.response.data
    );
  }
  throw err;
}

const startServer = memoize(async () => {
  return (await createServer()).listen();
});

async function clearDB(done = null, dropDb = false) {
  for (let i = 0; i < mongoose.connection.collections; i++) {
    await mongoose.connection.collections[i].drop();
  }

  if (dropDb) {
    await mongoose.connection.dropDatabase();
  }

  if (done) {
    done();
  }
}

// const getMongoTestUri = () => {
//   return `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${
//     process.env.MONGO_HOST
//   }/${process.env.MONGO_DB}_${process.env.NODE_ENV}`
// }
const mongoConfig = getConfiguration(/** global.__MONGO_URI__**/);

beforeAll(async (done) => {
  if (mongoose.connection.readyState === 0) {
    await connect(mongoConfig);
  }
  await clearDB(done);
});

// beforeEach(async done => {
//   if (mongoose.connection.readyState === 0) {
//     await createConnection(getMongoTestUri())
//   }

//   done()
// })

// afterEach(async done => {
//   if (mongoose.connection.readyState === 1) {
//     await mongoose.disconnect()
//   }

//   return done()
// })

afterAll(async (done) => {
  // Server is memoized so it won't start a new one.
  // We need to close it.
  if (mongoose.connection.readyState === 1) {
    await clearDB(null, true);
    await mongoose.connection.close();
  }

  const server = await startServer();
  server.close();

  return done();
});

function mergeObjects(object1, object2) {
  return [object1, object2].reduce(function (carry, objectToMerge) {
    Object.keys(objectToMerge).forEach(function (objectKey) {
      carry[objectKey] = objectToMerge[objectKey];
    });
    return carry;
  }, {});
}

function isArray(val) {
  return {}.toString.call(val) === '[object Array]';
}

function isJsonObject(val) {
  return (
    !isArray(val) &&
    typeof val === 'object' &&
    !!val &&
    // !(val instanceof Blob) &&
    !(val instanceof Date)
  );
}

function isAppendFunctionPresent(formData) {
  return typeof formData.append === 'function';
}

function isGlobalFormDataPresent() {
  return typeof FormData === 'function';
}

export function convert(jsonObject, options = {}) {
  const defaultOptions = {
    showLeafArrayIndexes: true,
    includeNullValues: false,
  };

  var mergedOptions = mergeObjects(defaultOptions, options || {});

  return convertRecursively(jsonObject, mergedOptions, {});
}

function convertRecursively(jsonObject, options, convertObject, parentKey) {
  var index = 0;

  for (var key in jsonObject) {
    if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
      var propName = parentKey || key;
      var value = jsonObject[key];

      if (parentKey && isJsonObject(jsonObject)) {
        propName = `${parentKey}[${key}]`;
      }

      if (parentKey && isArray(jsonObject)) {
        if (isArray(value) || options.showLeafArrayIndexes) {
          propName = `${parentKey}[${index}]`;
        } else {
          propName = `${parentKey}[]`;
        }
      }

      if (isArray(value) || isJsonObject(value)) {
        convertObject = convertRecursively(
          value,
          options,
          convertObject,
          propName
        );
      }
      // else if (value instanceof FileList) {
      //   for (var j = 0; j < value.length; j++) {
      //     convertObject[`${propName}[${j}]`] = value.item(j);
      //   }
      // }
      // else if (value instanceof Blob) {
      //   convertObject[propName] = value;
      // }
      else if (value instanceof Date) {
        convertObject[propName] = value.toISOString();
      } else if (
        ((value === null && options.includeNullValues) || value !== null) &&
        value !== undefined
      ) {
        convertObject[propName] = value;
      }
    }
    index++;
  }
  return convertObject;
}

export function createS3Bucket(bucket) {
  const S3 = new AWS.S3();

  S3.createBucket({
    ACL: 'public-read',
    Bucket: bucket,
  });

  return (cb) => S3.deleteBucket({ Bucket: bucket, cb });
}
export function createSQSQueue(queue) {
  const SQS = new AWS.SQS();

  SQS.createQueue(
    {
      QueueName: queue,
    },
    (err, data) => {
      if (err) console.error(err);
    }
  );

  return (cb) => SQS.deleteQueue({ QueueName: queue, cb });
}

export function createAndExposeQueue(
  cb = undefined,
  queueName = 'SendEmailQueue',
  envName = 'QUEUE_URL'
) {
  const sqs = new AWS.SQS();

  return sqs.createQueue({ QueueName: queueName }, (err, data) => {
    if (err) {
      if (cb) cb.fail(err);
      return;
    }
    // eslint-disable-next-line no-undef
    process.env[envName] = data.QueueUrl;

    if (cb) cb();
  });
}
