import GridFsManager from '../../storage/gridfs';
import path from 'path';
import mime from 'mime';

const image = path.resolve(__dirname, 'fixtures', 'image.jpg');

describe('GridFSManager', () => {
  it('create(image) - should create a new file and resize if its an image', async () => {
    const gridfs = new GridFsManager();
    const file = {
      path: image,
      type: mime.getType(image),
    };

    const result = await gridfs.create(file, {
      resizeOptions: {
        fit: 'inside',
      },
    });

    expect(result).not.toBeNull();
    expect(result.metadata.imageSize).not.toBeNull();
    expect(result.metadata.imageSize).toEqual(gridfs.DEFAULT_SIZE);
    expect(result.contentType).not.toBeNull();
    expect(result.fileId).not.toBeNull();
    expect(result.url).not.toBeNull();
    expect(result.filename).not.toBeNull();
  });

  it('findByFilename - should retrieve a file by filename', async (done) => {
    const gridfs = new GridFsManager();
    const file = {
      path: image,
      type: mime.getType(image),
    };

    const result = await gridfs.create(file, {
      resizeOptions: {
        fit: 'inside',
      },
    });

    setTimeout(async () => {
      const fileFound = await gridfs.findByFilename(result.filename);

      expect(fileFound).not.toBeNull();

      return done();
    }, 1000);
  });

  it('findById - should retrieve a file by filename', async (done) => {
    const gridfs = new GridFsManager();
    const file = {
      path: image,
      type: mime.getType(image),
    };

    const result = await gridfs.create(file, {
      resizeOptions: {
        fit: 'inside',
      },
    });

    setTimeout(async () => {
      const fileFound = await gridfs.findById(result.fileId);

      expect(fileFound).not.toBeNull();

      return done();
    }, 1000);
  });

  it('update - should update a file', async (done) => {
    const gridfs = new GridFsManager();

    const file = {
      path: image,
      type: mime.getType(image),
    };

    const result = await gridfs.create(file, {
      resizeOptions: {
        fit: 'inside',
      },
    });

    setTimeout(async () => {
      const update = await gridfs.update(result.filename, file, {
        resizeOptions: {
          fit: 'inside',
        },
      });

      expect(update).not.toBeNull();
      expect(update.updated).toBeTruthy();
      expect(update.upsert).toBeFalsy();
      expect(update.newFile).not.toBeNull();
      expect(update.newFile.metadata.imageSize).not.toBeNull();
      expect(update.newFile.metadata.imageSize).toEqual(gridfs.DEFAULT_SIZE);
      expect(update.newFile.contentType).not.toBeNull();
      expect(update.newFile.fileId).not.toBeNull();
      expect(update.newFile.url).not.toBeNull();
      expect(update.newFile.filename).not.toBeNull();
      return done();
    }, 1000);
  });

  it('update with no previous file - should create the file', async (done) => {
    const gridfs = new GridFsManager();

    const file = {
      path: image,
      type: mime.getType(image),
    };

    setTimeout(async () => {
      const update = await gridfs.update('file-unknown.jpg', file, {
        resizeOptions: {
          fit: 'inside',
        },
      });

      expect(update).not.toBeNull();
      expect(update.updated).toBeTruthy();
      expect(update.upsert).toBeTruthy();
      expect(update.oldFile).toBeNull();
      expect(update.newFile).not.toBeNull();
      expect(update.newFile.metadata.imageSize).not.toBeNull();
      expect(update.newFile.metadata.imageSize).toEqual(gridfs.DEFAULT_SIZE);
      expect(update.newFile.contentType).not.toBeNull();
      expect(update.newFile.fileId).not.toBeNull();
      expect(update.newFile.url).not.toBeNull();
      expect(update.newFile.filename).not.toBeNull();
      return done();
    }, 1000);
  });

  it('remove - should remove a file', async (done) => {
    const gridfs = new GridFsManager();

    const file = {
      path: image,
      type: mime.getType(image),
    };

    const result = await gridfs.create(file, {
      resizeOptions: {
        fit: 'inside',
      },
    });

    setTimeout(async () => {
      const removed = await gridfs.remove(result.filename);

      expect(removed).not.toBeNull();
      expect(removed.deleted).toBeTruthy();

      return done();
    }, 1000);
  });

  it('remove(unknown) - should return null on non-existing file', async () => {
    const gridfs = new GridFsManager();
    const removed = await gridfs.remove('file-unknown.jpg');
    expect(removed).toBeNull();
  });
});
