import { apiHelper } from './api-helper';
import { configureContainer } from '../lib/container';
import {
  STATUS_FAILED,
  STATUS_PASSED,
  STATUS_PENDING,
} from '../models/mongo/link_bot_report';
import { Report, UserModel } from '../models/mongo';

let request = null;
let user = null;
let reports = null;

describe('ReportsApi', () => {
  beforeAll(async (done) => {
    const helpers = await apiHelper();
    const container = configureContainer();

    request = helpers.request;

    await Report.deleteMany({}).exec();
    await UserModel.deleteMany({}).exec();

    reports = await Report.insertMany([
      createReport(STATUS_FAILED),
      createReport(STATUS_FAILED),
      createReport(STATUS_FAILED),
      createReport(STATUS_PASSED),
      createReport(STATUS_PASSED),
      createReport(STATUS_PASSED),
    ]);

    user = await container.cradle.userStore.create({
      roles: ['admin'],
      active: true,
      email: 'test_report_api@example.com',
      password: 'P@ssw0rd',
    });

    done();
  });

  it('GET /api/reports unauthorized call should return 401 status code', async () => {
    await request.get('/api/reports').expect(401);
  });

  it('GET /api/reports should return all available reports', async () => {
    const { body } = await request
      .get('/api/reports')
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .expect(200);

    expect(body.itemCount).toEqual(6);
  });

  it('GET /api/reports/:id should return the given report', () => {
    return request
      .get('/api/reports/' + reports[0]._doc._id)
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .expect(200);
  });

  it('GET /api/reports/unkinown_id should return 404 Not Found', () => {
    return request
      .get('/api/reports/xxxxx')
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .expect(404);
  });

  it('PUT /api/reports/:id should update the report', async () => {
    const response = await request
      .put('/api/reports/' + reports[0]._doc._id)
      .set('Authorization', `Bearer ${user.generateJWT()}`)
      .send({ read: true })
      .expect(200);

    expect(response.body.report.read).toEqual(true);
  });
});

function createReport(status) {
  return {
    status: status || STATUS_PENDING,
  };
}
