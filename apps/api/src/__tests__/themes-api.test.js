/* eslint-disable no-console */
import { apiHelper, convert } from './api-helper';
import { configureContainer } from '../lib/container';
import { createThemeObject, createThemesForSearch } from './themes-helpers';
import path from 'path';
import bluebird from 'bluebird';
import Theme from '../models/mongo/theme';
import User from '../models/mongo/user';
import AWS from 'aws-sdk';

jest.genMockFromModule('aws-sdk');
jest.mock('aws-sdk');

const promiseMock = jest.fn().mockResolvedValue(true);

const sendMessageMock = jest.fn(() => {
  return {
    promise: promiseMock,
  };
});

function createS3UploadMock(payload) {
  return jest.fn((callback) => {
    if (payload instanceof Error) return callback(payload, null);
    if (typeof payload === 'object') return callback(null, payload);
  });
}
const uploadMock = jest.fn(() => {
  return {
    on: jest.fn(),
    send: createS3UploadMock({
      Location: 'http://assets.localhost/images/sample.png',
      Etag: 'etag',
    }),
  };
});

AWS.SQS = jest.fn(() => {
  return {
    sendMessage: sendMessageMock,
  };
});

AWS.S3 = jest.fn(() => {
  return {
    upload: uploadMock,
  };
});

let request;
let container;
let store;
let user;

describe('ThemesApi', () => {
  beforeAll(async (done) => {
    await bluebird.all([Theme.deleteMany({}), User.deleteMany({})]);

    const api = await apiHelper();
    container = configureContainer();

    store = container.cradle.themeStore;
    request = api.request;

    await User.deleteMany({ email: 'test_themes_api@example.com' }).exec();

    user = await container.cradle.userStore.create({
      active: true,
      email: 'test_themes_api@example.com',
      password: 'P@ssw0rd',
    });

    return done();
  });

  // beforeEach(() => {
  //   return Theme.deleteMany({}).exec()
  // })

  describe('Private endpoints', () => {
    it('should return 401 satus code on all themes endpoints', async (done) => {
      await request.post('/api/themes').expect(401);
      await request.put('/api/themes/1').expect(401);
      await request.delete('/api/themes/1').expect(401);
      done();
    });
  });

  describe('Open endpoints', () => {
    it('should return 200 status code', async () => {
      const { id } = await store.create(createThemeObject());
      // request.get('/api/themes').expect(200)
      return request.get(`/api/themes/${id}`).expect(200);
    });
  });

  it('GET /api/themes?q=<term> should return the given result set', async () => {
    await bluebird.all([
      Theme.deleteMany({}).exec(),
      Theme.insertMany(createThemesForSearch()),
    ]);

    const response = await request
      .get('/api/themes')
      .query({ q: 'planifier un budget' });

    expect(response.status).toEqual(200);
    expect(response.body.itemCount).toEqual(1);
    expect(response.body.currentPage).toEqual(1);
    expect(response.body.perPage).toEqual(25);
    expect(response.body.pageCount).toEqual(1);
  });

  it('GET /api/themes/:id should return the given Theme for the given :id', async () => {
    await Theme.deleteMany({}).exec();
    const theme = await store.create(createThemeObject({ name: 'Theme 54' }));

    const response = await request.get(`/api/themes/${theme.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.result.name).toEqual(theme.name);
  });

  it('GET /api/themes/:id unknown :id should return 404 Not Found status code', async () => {
    return request.get('/api/themes/unknown').expect(404);
  });

  it('POST /api/themes should create a new Theme and return 201 Created status code', async () => {
    const response = await request
      .post('/api/themes')
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .send(createThemeObject({ name: 'Theme 1' }))
      .expect(201);

    await request.get(response.get('Location')).expect(200);
  });

  it('POST /api/themes should create a new Theme + icon should return 201 Created status code', async () => {
    const response = await request
      .post('/api/themes')
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .field(convert(createThemeObject({ name: 'Alimentation' })))
      .attach('icon', path.join(__dirname, 'fixtures', 'image.jpg'));

    expect(response.status).toEqual(201);

    const { body } = await request.get(response.get('Location')).expect(200);
    const {
      result: { icon, _metadata },
    } = body;

    expect(_metadata.s3).not.toBeNull();
    expect(_metadata.s3.length).toEqual(6);
    expect(icon.original).not.toBeNull();
    expect(icon.xlg).not.toBeNull();
    expect(icon.lg).not.toBeNull();
    expect(icon.md).not.toBeNull();
    expect(icon.sm).not.toBeNull();
    expect(icon.xs).not.toBeNull();
    expect(icon.xs).not.toBeNull();
  });

  it('PUT /api/themes/:id should update the Theme for the given :id and return 200 Ok status code', async () => {
    const theme = await Theme.create(createThemeObject({ name: 'Theme 2' }));

    const update = { name: 'Theme 2 Updated' };

    await request
      .put(`/api/themes/${theme.id}`)
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .send(update)
      .expect(200);

    const {
      body: { result },
    } = await request.get(`/api/themes/${theme.id}`).expect(200);

    expect(result.name).toEqual(update.name);
  });

  it('PUT /api/themes/:id should update the Theme with upload for the given :id and return 200 Ok status code', async () => {
    const theme = await Theme.create(createThemeObject({ name: 'New Theme' }));
    const data = convert(createThemeObject({ name: 'Updated Theme' }));

    await request
      .put(`/api/themes/${theme.id}`)
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .field(data)
      .attach('icon', path.join(__dirname, 'fixtures', 'image.jpg'))
      .expect(200);

    const {
      body: {
        result: { name, icon, _metadata },
      },
    } = await request.get(`/api/themes/${theme.id}`).expect(200);

    expect(name).not.toEqual(theme.name);
    expect(name).toEqual('Updated Theme');
    expect(_metadata.s3).not.toBeNull();
    expect(_metadata.s3.length).toEqual(6);
    expect(icon.original).not.toBeNull();
    expect(icon.xlg).not.toBeNull();
    expect(icon.lg).not.toBeNull();
    expect(icon.md).not.toBeNull();
    expect(icon.sm).not.toBeNull();
    expect(icon.xs).not.toBeNull();
    expect(icon.xs).not.toBeNull();
  });

  it('DELETE /api/themes/:id should mark the Theme for the given :id as deleted and draft and return 200 Ok status code', async () => {
    const response = await request
      .post('/api/themes')
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .send(createThemeObject({ name: 'Theme to be deleted' }))
      .expect(201);

    await request
      .delete(response.get('Location'))
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .expect(200);

    const { body } = await request.get(response.get('Location')).expect(200);

    expect(body.result.deletedeAt).not.toBeNull();
    expect(body.result.draft).toBeTruthy();
  });
});
