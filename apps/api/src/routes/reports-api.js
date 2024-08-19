import { route, GET, PUT, before } from 'awilix-koa';
import passport from 'koa-passport';
import validate from 'koa2-validation';
import { v } from '../lib/validations/search-validations';
import { v as vReport } from '../lib/validations/reportValidations';
import * as Utils from '../lib/utils';
import rules from '../lib/roles';
import { pick } from 'lodash';

@route('/api/reports')
@before([
  passport.authenticate('jwt', { session: false }),
  rules.can('manage reports'),
])
export default class ReportApi {
  constructor({ logger, reportStore }) {
    this.logger = logger;
    this.reportStore = reportStore;
  }

  @GET()
  @before([validate(v.index)])
  async find(ctx) {
    const { page, offset, limit, sort } = ctx.query;
    const paginationOptions = {
      page: page || 1,
      offset: offset || 0,
      limit: limit || process.env.PER_PAGE || 15,
    };

    if (sort) {
      paginationOptions.sort = Utils.transformSort(sort);
    }

    const query = pick(ctx.query, ['status', 'read']);

    const results = await this.reportStore.find(query, paginationOptions);
    ctx.ok({
      status: 200,
      message:
        Object.keys(query).length > 0 ? 'report_filtered' : 'report_list',
      ...results,
    });
  }

  @route('/:id')
  @GET()
  @before([validate(v.get)])
  async get(ctx) {
    const result = await this.reportStore.get(ctx.params.id);

    ctx.assert(result, 404, `report ${ctx.params.id} not found!`, {
      message: `report ${ctx.params.id} not found!`,
    });
    ctx.ok({ status: 200, message: 'found', result });
  }

  @route('/:id')
  @PUT()
  @before([validate(vReport.update)])
  async put(ctx) {
    const doc = await this.reportStore.get(ctx.params.id);
    ctx.assert(doc, 404, `report ${ctx.params.id} not found!`, {
      message: `report ${ctx.params.id} not found!`,
    });
    const report = await this.reportStore.update(ctx.params.id, {
      read: ctx.request.body.read,
    });
    ctx.ok({ status: 200, message: 'report_updated', report });
  }
}
