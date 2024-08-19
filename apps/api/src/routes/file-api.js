import { route, GET, POST, before } from 'awilix-koa';
import passport from 'koa-passport';
import koaBody from 'koa-body';
import os from 'os';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import mongoose from 'mongoose';
import { connect } from '../lib/mongoose';

@route('/api/files')
export default class FileApi {
  constructor({ logger }) {
    this.logger = logger;
  }

  @route('/tmp/:filename')
  @GET()
  async get(ctx) {
    const filename = path.resolve(os.tmpdir(), ctx.params.filename);
    ctx.type = mime.getType(filename);
    ctx.body = fs.createReadStream(filename);
  }

  @route('/:filename')
  @GET()
  async getFile(ctx) {
    const { filename } = ctx.params;
    const collectionName = 'files.files';
    const mongodb = await connect();
    let file = null;

    if (mongoose.Types.ObjectId.isValid(filename)) {
      file = await mongodb.connection.db
        .collection(collectionName)
        .findOne({ _id: new mongoose.Types.ObjectId(filename) });
    }

    if (!file) {
      file = await mongodb.connection.db
        .collection(collectionName)
        .findOne({ filename });
      if (!file) {
        this.logger.debug({ collectionName, filename, file });
        ctx.notFound({ status: 404, message: 'file_not_found', filename });
      }
    }

    ctx.type = file.contentType;
    const bucket = await this.createBucket('files');

    ctx.body = bucket.openDownloadStream(file._id);
  }

  @POST()
  @before([
    passport.authenticate('jwt', { session: false }),
    koaBody({
      multipart: true,
      formidable: {
        keepExtensions: true,
        hash: 'sha1',
        multiples: false,
      },
    }),
  ])
  async post(ctx) {
    const file = ctx.request.files.file;
    const filename = 'file-' + Date.now() + path.extname(file.path);

    const bucket = await this.createBucket('files');

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
      metadata: {
        fileInfo: file,
      },
    });

    const readableStream = fs.createReadStream(file.path);
    const fileId = uploadStream.id;

    readableStream.pipe(uploadStream);

    const url = `/api/files/${filename}`;
    ctx.created({ status: 201, message: 'file_uploaded', url, fileId });

    // try {

    // } catch (err) {
    //   this.logger.error(err)
    //   ctx.status = 500
    //   ctx.body = { status: 500, message: "internal_server_error" }
    // }
  }

  // @route('/:filename')
  // @PUT()
  // @before([passport.authenticate('jwt', { session: false })])
  // async put(ctx) {
  //   ctx.ok({ status: 200, message: 'restored', result });
  // }

  // @route('/:filename')
  // @DELETE()
  // @before([passport.authenticate('jwt', { session: false })])
  // async delete(ctx) {
  //   ctx.ok({ status: 200, message: 'deleted', result });
  // }

  async createBucket(bucketName) {
    await connect();
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName,
    });
    return bucket;
  }
}
