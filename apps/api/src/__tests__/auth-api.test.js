import Koa from 'koa';
import Router from '@koa/router';
import { scopePerRequest } from 'awilix-koa';
import User from '../models/mongo/user';
import supertest from 'supertest';
import { apiHelper } from './api-helper';
import { configureContainer } from '../lib/container';
import passport from 'koa-passport';
import '../lib/auth';

let request;
let container;

describe('AuthApi', () => {
  beforeAll(async (done) => {
    await User.deleteMany({});
    const api = await apiHelper();
    container = configureContainer();
    request = api.request;
    return done();
  });

  describe('Validations', () => {
    it('empty email - should return status 422 code', () => {
      return request.post('/api/auth/signin').send({}).expect(422);
    });

    it('invalid email address format - should return status 422 code', () => {
      return request
        .post('/api/auth/signin')
        .send({ email: 'email#' })
        .expect(422);
    });

    it('empty password - should return status 422 code', () => {
      return request
        .post('/api/auth/signin')
        .send({ email: 'person@example.com' })
        .expect(422);
    });

    // it('password required min=8 - should return 422 status code', () => {
    //   return request
    //     .post('/api/auth/signin')
    //     .send({ email: 'person@example.com', password: '1234567' })
    //     .expect(422)
    // })
  });

  describe('signin', () => {
    it('invalid credentials -- should return 400 status code', () => {
      return request
        .post('/api/auth/signin')
        .send({ email: 'person0@example.com', password: 'P@ssw0rd' })
        .expect(400, { status: 400, message: 'email or password invalid!' });
    });

    it('valid credentials -- should return 200 status code', async (done) => {
      const user = await container.cradle.userStore.create({
        active: true,
        email: 'person100@example.com',
        password: 'P@ssw0rd',
      });
      request
        .post('/api/auth/signin')
        .send({ email: 'person100@example.com', password: 'P@ssw0rd' })
        .expect(200, (_, { body: { status, email, token } }) => {
          expect(status).toEqual(200);
          expect(email).toEqual(user.email);
          expect(token).toBeDefined();
          return done();
        });
    });

    it('valid credentials active=false -- should return 400 status code', async () => {
      await container.cradle.userStore.create({
        email: 'person2@example.com',
        password: 'P@ssw0rd',
      });

      return request
        .post('/api/auth/signin')
        .send({ email: 'person2@example.com', password: 'P@ssw0rd' })
        .expect(400, { status: 400, message: 'email or password invalid!' });
    });
  });

  describe('Auth middleware', () => {
    var authRequest;
    var server;

    beforeAll(async () => {
      const app = new Koa();
      const router = new Router();

      router.get(
        '/protected',
        passport.authenticate('jwt', { session: false }),
        (ctx) => {
          ctx.status = 200;
          ctx.body = { email: ctx.state.container.cradle.currentUser.email };
        }
      );

      app
        .use(passport.initialize())
        .use(scopePerRequest(container))
        .use(router.routes())
        .use(router.allowedMethods());

      server = app.listen();

      authRequest = supertest(server);
    });

    afterAll((done) => {
      return server.close(() => done());
    });

    it('should return 200 status code with valid jwt', async () => {
      const user = await container.cradle.userStore.create({
        email: 'person200@example.com',
        password: 'P@ssw0rd',
      });
      const token = user.generateJWT();

      return authRequest
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200, { email: user.email });
    });

    it('should return 401 status code with no jwt', async () => {
      return authRequest.get('/protected').expect(401);
    });
  });
});
