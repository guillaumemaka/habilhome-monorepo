import multer from '@koa/multer';
import storageS3 from 'multer-s3-transform';
import aws from 'aws-sdk';
import '../aws';

const bucket = process.env.AWS_BUCKET || 'assets';
const defaultAcl = 'public-read';

export const s3 = new aws.S3();

export const createS3Storage = (s3options = { acl: defaultAcl }) => {
  return multer({
    storage: storageS3({
      s3,
      bucket,
      contentType: storageS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        cb(null, Date.now().toString());
      },
      ...s3options,
    }),
  });
};

const defaultStorage = createS3Storage();

export default defaultStorage;
