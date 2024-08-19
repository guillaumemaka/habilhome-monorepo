import { apiHelper } from './api-helper';
import { configureContainer } from '../lib/container';
import User from '../models/mongo/user';
import Theme from '../models/mongo/theme';
import { DomainModel } from '../models/mongo/abstract_model';
import { createApplicationObject } from './applications-helpers';
import { createObject } from './objects-helpers';
import { createThemesForSearch } from './themes-helpers';
import bluebird from 'bluebird';

let request = null;
let user = null;

describe('StatsApi', () => {
  beforeAll(async () => {
    const helpers = await apiHelper();
    const container = configureContainer();

    request = helpers.request;

    await bluebird.all([
      User.deleteMany({}).exec(),
      DomainModel.deleteMany({}).exec(),
      Theme.deleteMany({}).exec(),
    ]);

    await bluebird.all([
      DomainModel.insertMany([
        createObject({ kind: 'ConnectedObject', name: 'Rocket Book' }),
        createObject({ kind: 'ConnectedObject', name: 'Mini Rocket Book' }),
        createObject({ kind: 'ConnectedObject', name: 'Smart Scale' }),
        createObject({ kind: 'ConnectedObject', name: 'Smart Oven' }),
        createApplicationObject({ kind: 'Application', name: 'Facebook' }),
        createApplicationObject({ kind: 'Application', name: 'Messenger' }),
        createApplicationObject({ kind: 'Application', name: 'Linkedin' }),
        createApplicationObject({ kind: 'Application', name: 'Youtube' }),
      ]),
      Theme.insertMany(createThemesForSearch()),
    ]);

    user = await container.cradle.userStore.create({
      active: true,
      email: 'test_stats_api@example.com',
      password: 'P@ssw0rd',
    });
  });

  it('GET /api/stats unauthorized call should return 401 status code', async () => {
    await request.get('/api/stats').expect(401);
  });

  it('GET /api/stats sould return all available stats', async () => {
    const { body } = await request
      .get('/api/stats')
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .expect(200);

    expect(body.stats.object).toEqual({
      total: 4,
      trashed: 0,
      published: 4,
      drafted: 0,
    });

    expect(body.stats.application).toEqual({
      total: 4,
      trashed: 0,
      published: 4,
      drafted: 0,
    });

    expect(body.stats.theme).toEqual({
      total: 4,
      trashed: 1,
      published: 3,
      drafted: 1,
    });
  });
});
