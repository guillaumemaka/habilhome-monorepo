import { apiHelper } from './api-helper';
import { configureContainer } from '../lib/container';
import { createObject } from './objects-helpers';
import { createThemesForSearch as createThemes } from './themes-helpers';
import bluebird from 'bluebird';
import ConnectedObject from '../models/mongo/connected_object';
import User from '../models/mongo/user';
import Theme from '../models/mongo/theme';

let request;
let container;
let store;
let user;
let token;

describe('ObjectApi', () => {
  beforeAll(async (done) => {
    const api = await apiHelper();
    container = configureContainer();

    store = container.cradle.objectStore;
    request = api.request;

    await bluebird.all([
      User.deleteMany({}),
      ConnectedObject.deleteMany({}),
      Theme.deleteMany({}),
    ]);

    await Theme.insertMany(createThemes());

    user = await container.cradle.userStore.create({
      active: true,
      email: 'test_objects_api@example.com',
      password: 'P@ssw0rd',
    });
    token = user.generateJWT();
    return done();
  });

  beforeEach(async (done) => {
    await ConnectedObject.deleteMany({}).exec();
    return done();
  });

  describe('Private endpoints', () => {
    it('should return 401 status code on all objects endpoints', () => {
      request.post('/api/objects').expect(401);
      request.put('/api/objects/1').expect(401);
      request.delete('/api/objects/1').expect(401);
    });
  });

  describe('Open endpoints', () => {
    it('should return 200 status code', async () => {
      const { id } = await store.create(createObject());
      // request.get('/api/objects').expect(200)
      request.get(`/api/objects/${id}`).expect(200);
    });
  });

  it('GET /api/objects?q=<term> should return the given result set', async () => {
    await ConnectedObject.deleteMany({}).exec();

    await bluebird.all([
      store.create(createObject({ name: 'Mother' })),
      store.create(createObject({ name: 'Nexus Player' })),
      store.create(createObject({ name: 'Alexa Dot' })),
      store.create(createObject({ name: 'Rocku' })),
    ]);

    const response = await request.get('/api/objects').query({ q: 'mother' });

    expect(response.status).toEqual(200);
    expect(response.body.itemCount).toEqual(1);
    expect(response.body.currentPage).toEqual(1);
    expect(response.body.perPage).toEqual(25);
    expect(response.body.pageCount).toEqual(1);
  });

  it('GET /api/objects/:id should return the given object for the given :id', async () => {
    await ConnectedObject.deleteMany({}).exec();
    const [alexa] = await bluebird.all([
      store.create(createObject({ name: 'Alexa' })),
      store.create(createObject({ name: 'Google Home' })),
      store.create(createObject({ name: 'Apple Watch Serie 4' })),
      store.create(createObject({ name: 'Chrome Cast' })),
    ]);

    const response = await request.get(`/api/objects/${alexa.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.result.name).toEqual(alexa.name);
  });

  it('GET /api/objects/:id unknown :id should return 404 Not Found status code', async () => {
    return request.get('/api/objects/unknown').expect(404);
  });

  it('POST /api/objects should create a new object and return 201 Created status code', async () => {
    await ConnectedObject.deleteMany({}).exec();
    const object = createObject({ name: 'Chrome Cast Audio' });
    const response = await request
      .post('/api/objects')
      .set('Authorization', `Bearer ${token}`)
      .send(object)
      .expect(201);

    await request.get(response.get('Location')).expect(200);
  });

  it('PUT /api/objects/:id should update the object for the given :id and return 200 Ok status code', async () => {
    await ConnectedObject.deleteMany({}).exec();
    const object = createObject({ name: 'Apple TV' });
    const response = await request
      .post('/api/objects')
      .set('Authorization', `Bearer ${token}`)
      .send(object)
      .expect(201);

    await request
      .put(response.get('Location'))
      .set('Authorization', `Bearer ${token}`)
      .send({ ...object, name: 'Apple TV 2' })
      .expect(200);

    const { body } = await request.get(response.get('Location')).expect(200);

    expect(body.result.name).toEqual('Apple TV 2');
  });

  it('DELETE /api/objects/:id should mark the object for the given :id as deleted and draft and return 200 Ok status code', async () => {
    await ConnectedObject.deleteMany({}).exec();
    const response = await request
      .post('/api/objects')
      .set('Authorization', `Bearer ${token}`)
      .send(createObject({ name: 'Ear Pod' }))
      .expect(201);

    await request
      .delete(response.get('Location'))
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { body } = await request.get(response.get('Location')).expect(200);

    expect(body.result.deletedeAt).not.toBeNull();
    expect(body.result.draft).toBeTruthy();
  });
});
