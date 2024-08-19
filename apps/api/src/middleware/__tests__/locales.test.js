import Koa from 'koa';
import Router from '@koa/router';
import { scopePerRequest } from 'awilix-koa';
import { configureContainer } from '../../lib/container';
import cookie from 'koa-cookie';
import supertest from 'supertest';
import registerLang from '../locales';

describe('Locales middleware', () => {
  var server;
  let request;
  let container;

  beforeAll(async (done) => {
    const app = new Koa();
    const router = new Router();

    container = configureContainer();

    router.get('/', (ctx) => {
      ctx.status = 200;
    });

    app
      .use(cookie())
      .use(scopePerRequest(container))
      .use(registerLang)
      .use(router.routes())
      .use(router.allowedMethods());

    server = app.listen();

    request = supertest(server);

    return done();
  });

  afterAll((done) => {
    server.close();
    return done();
  });

  it('lang should be fr by default', async () => {
    return request.get('/').expect('set-cookie', /lang=fr;/);
  });

  it('lang should be fr by default if accept-language not in the accepted languages', async () => {
    return request
      .get('/')
      .set('Accept-Language', 'de-CH;q=0.5,fr;q=0.4')
      .expect('set-cookie', /lang=fr;/);
  });

  it('using cookie set-cookie should be set to the given lang', async () => {
    return request
      .get('/')
      .set('Cookie', 'lang=en; Path=/;')
      .expect('set-cookie', /lang=en;/);
  });

  it('query should take precedence over header accept-language', async () => {
    return request
      .get('/')
      .query({ lang: 'en' })
      .set('Accept-Language', 'fr;q=0.9,de-CH;q=0.5,fr;q=0.4')
      .expect('set-cookie', /lang=en;/);
  });

  it('header should take precedence over default hard coded language', async () => {
    return request
      .get('/')
      .set('Accept-Language', 'en;q=0.9,de-CH;q=0.5,fr;q=0.4')
      .expect('set-cookie', /lang=en;/);
  });

  it('cookie "lang=en" should override default hardcoded language "fr"', async () => {
    return request
      .get('/')
      .set('Cookie', 'lang=en; Path=/;')
      .expect('set-cookie', /lang=en;/);
  });
});
