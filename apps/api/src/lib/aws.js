import AWS from 'aws-sdk';
import { logger } from './logger';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'ca-central-1';

// Production use executionRoles attached to the container/service
// Use Access Key/secret key for other environment (dev,test)
if (['development'].includes(process.env.NODE_ENV)) {
  // eslint-disable-next-line no-console
  console.log(process.env);
  const endpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566/';
  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
    s3: {
      endpoint,
    },
    sqs: {
      endpoint,
    },
    s3ForcePathStyle: true,
  });

  const sqs = new AWS.SQS();

  sqs.createQueue(
    {
      QueueName: 'SendEmailQueue',
    },
    (err, data) => {
      if (err) {
        logger.info(err.message, { error: err });
        return;
      }

      logger.info(data.QueueUrl, { data });
      process.env.QUEUE_URL = data.QueueUrl;
    }
  );

  if (process.env.AWS_BUCKET) {
    const s3 = new AWS.S3();
    s3.createBucket(
      {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKET,
      },
      (err) => {
        if (err) {
          logger.error(err.message, { error: { code: err.code } });
        }
      }
    );
  }
}

export default AWS;
