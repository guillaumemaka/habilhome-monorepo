import { getConfiguration } from '../../lib/mongoose';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import { startsWith } from 'lodash';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { logger } from '../logger';

export default class GridFSManager {
  constructor(options = {}) {
    this.DEFAULT_SIZE = options.size || {
      width: 278,
      height: 253,
    };

    this.bucketName = options.bucketName || 'files';
    this.collectionName = `${this.bucketName}.${
      options.collectionName || 'files'
    }`;
  }

  async create(file, meta = {}) {
    try {
      const filename = 'file-' + Date.now() + path.extname(file.path);

      const fileMetada = {
        contentType: file.type,
        metadata: {
          ...meta,
          fileInfo: file,
        },
      };

      if (fileMetada.size) {
        delete fileMetada.metadata.size;
      }

      if (this._isImageType(file)) {
        fileMetada.metadata.imageSize = meta.size || this.DEFAULT_SIZE;
      }

      const bucket = await this._createBucket();

      const readableStream = fs.createReadStream(file.path);
      const uploadStream = bucket.openUploadStream(filename, fileMetada);

      const fileId = uploadStream.id;

      if (this._isImageType(file)) {
        readableStream.pipe(this._resize(meta)).pipe(uploadStream);
      } else {
        readableStream.pipe(uploadStream);
      }

      return {
        ...fileMetada,
        fileId,
        filename,
        url: `/api/files/${filename}`,
      };
    } catch (error) {
      logger.error(error.message, { error });
    }
  }

  async update(fileIdOrFilename, file, meta = {}) {
    const oldFile = await this.findByFilename(fileIdOrFilename);

    if (oldFile) {
      const deleteResp = await this.remove(oldFile._id);

      if (deleteResp instanceof Error) {
        return { updated: false, error: deleteResp };
      }
    }

    const result = await this.create(file, meta);

    return {
      updated: true,
      upsert: !(oldFile && oldFile._id),
      oldFile,
      newFile: result,
    };
  }

  async remove(fileIdOrFilename) {
    const file = await this.findByFilename(fileIdOrFilename);
    if (file) {
      const bucket = await this._createBucket();
      return new Promise((resolve, reject) => {
        bucket.delete(file._id, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({ deleted: true, file });
          }
        });
      });
    }

    return null;
  }

  async findByFilename(filename) {
    const conn = await this._connect();

    const file = await conn.db
      .collection(this.collectionName)
      .findOne({ filename });

    conn.close();

    return file;
  }

  async findById(id) {
    const conn = await this._connect();

    const file = await conn.db
      .collection(this.collectionName)
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    conn.close();
    return file;
  }

  async createFromKoaContext(ctx, returnResponse = false) {
    const response = await this.create(
      ctx.request.files.file,
      ctx.request.body
    );

    if (returnResponse) {
      return response;
    }

    ctx.created({ status: 201, message: 'file_uploaded', response });
  }

  async updateFromKoaContext(ctx, returnResponse = false) {
    const response = await this.update(
      ctx.params.filename,
      ctx.request.files.file,
      ctx.request.body
    );

    if (returnResponse) {
      return response;
    }

    ctx.ok({ status: 200, message: 'file_updated', response });
  }

  _resize(options = {}) {
    const size = options.size || this.DEFAULT_SIZE;
    return sharp().resize(size.width, size.height, options.resizeOptions || {});
  }

  async _createBucket(bucketName = null) {
    const conn = await this._connect();
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: bucketName || this.bucketName,
    });

    return bucket;
  }

  async _connect() {
    const { uri, options } = getConfiguration();
    const conn = await mongoose.createConnection(uri, options);
    return conn;
  }

  _isImageType(file) {
    const contentType = mime.getType(file.path);
    return startsWith(contentType, 'image/');
  }
}
