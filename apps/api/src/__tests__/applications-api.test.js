import { apiHelper } from './api-helper';
import { configureContainer } from '../lib/container';
import { createApplicationObject } from './applications-helpers';
import { createThemesForSearch as createThemes } from './themes-helpers';
import bluebird from 'bluebird';
import Application from '../models/mongo/application';
import User from '../models/mongo/user';
import Theme from '../models/mongo/theme';

let request;
let container;
let store;
let user;
let token;

describe('ApplicationApi', () => {
  beforeAll(async (done) => {
    const api = await apiHelper();
    container = configureContainer();

    store = container.cradle.applicationStore;
    request = api.request;

    await bluebird.all([
      User.deleteMany({}),
      Application.deleteMany({}),
      Theme.deleteMany({}),
    ]);

    await Theme.insertMany(createThemes());

    user = await container.cradle.userStore.create({
      active: true,
      email: 'test_applications_api@example.com',
      password: 'P@ssw0rd',
    });
    token = user.generateJWT();
    return done();
  });

  describe('Private endpoints', () => {
    it('should return 401 status code on all applications endpoints', () => {
      request.post('/api/applications').expect(401);
      request.put('/api/applications/1').expect(401);
      request.delete('/api/applications/1').expect(401);
    });
  });

  describe('Open endpoints', () => {
    it('should return 200 status code', async () => {
      await Application.deleteMany({}).exec();
      const { id } = await store.create(createApplicationObject());
      // request.get('/api/applications').expect(200)
      request.get(`/api/applications/${id}`).expect(200);
    });
  });

  it('GET /api/applications?q=<term> should return the given result set', async () => {
    await Application.deleteMany({}).exec();
    await bluebird.all([
      store.create(createApplicationObject({ name: 'Trello 100' })),
      store.create(createApplicationObject({ name: 'Trello 200' })),
      store.create(createApplicationObject({ name: 'Trello 300' })),
      store.create(createApplicationObject({ name: 'Trello 400' })),
    ]);

    const response = await request
      .get('/api/applications')
      .query({ q: 'trel' });

    expect(response.status).toEqual(200);
    expect(response.body.itemCount).toEqual(4);
    expect(response.body.currentPage).toEqual(1);
    expect(response.body.perPage).toEqual(25);
    expect(response.body.pageCount).toEqual(1);
  });

  it('GET /api/applications/:id should return the given application for the given :id', async () => {
    await Application.deleteMany({}).exec();
    const [facebook] = await bluebird.all([
      store.create(createApplicationObject({ name: 'Facebook' })),
      store.create(createApplicationObject({ name: 'Messenger' })),
      store.create(createApplicationObject({ name: 'Linkedin' })),
      store.create(createApplicationObject({ name: 'Youtube' })),
    ]);

    const response = await request.get(`/api/applications/${facebook.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.result.name).toEqual(facebook.name);
  });

  it('GET /api/applications/:id unknown :id should return 404 Not Found status code', async () => {
    return request.get('/api/applications/unknown').expect(404);
  });

  it('POST /api/applications should create a new application and return 201 Created status code', async () => {
    const response = await request
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(createApplicationObject({ name: 'Twitter' }))
      .expect(201);

    await request.get(response.get('Location')).expect(200);
  });

  it('PUT /api/applications/:id should update the application for the given :id and return 200 Ok status code', async () => {
    await Application.deleteMany({}).exec();
    const app = createApplicationObject({ name: 'Application' });
    const response = await request
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(app)
      .expect(201);

    await request
      .put(response.get('Location'))
      .set('Authorization', `Bearer ${token}`)
      .send({ ...app, name: 'New Application Name' })
      .expect(200);

    const { body } = await request.get(response.get('Location')).expect(200);

    expect(body.result.name).toEqual('New Application Name');
  });

  it('DELETE /api/applications/:id should mark the application for the given :id as deleted and draft and return 200 Ok status code', async () => {
    await Application.deleteMany({}).exec();
    const response = await request
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(createApplicationObject({ name: 'Facebook 2' }))
      .expect(201);

    await request
      .delete(response.get('Location'))
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { body } = await request.get(response.get('Location')).expect(200);

    expect(body.result.deletedAt).not.toBeNull();
    expect(body.result.draft).toBeTruthy();
  });

  it('PUT /api/applications/:id/restore should restore the application for the given :id as not deleted and published and return 200 Ok status code', async () => {
    await Application.deleteMany({}).exec();
    const response = await request
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(createApplicationObject({ name: 'Facebook 2' }))
      .expect(201);

    await request
      .delete(response.get('Location'))
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request
      .put(`${response.get('Location')}/restore`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { body } = await request.get(response.get('Location')).expect(200);

    expect(body.result.deletedAt).toBeNull();
    expect(body.result.draft).toBeFalsy();
  });

  it('DELETE /api/applications/:id?hard=true should delete permanently the application for the given :id and return 200 Ok status code', async () => {
    await Application.deleteMany({}).exec();
    const response = await request
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(createApplicationObject({ name: 'Facebook 2' }))
      .expect(201);

    await request
      .delete(response.get('Location'))
      .query({ hard: true })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request.get(response.get('Location')).expect(404);
  });
});
