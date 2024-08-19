import { route, GET, before } from 'awilix-koa';
import validate from 'koa2-validation';
import { v } from '../lib/validations/search-validations';

export default class ItemApi {
  constructor({ logger, abstractModelStore }) {
    this.logger = logger;
    this.store = abstractModelStore;
  }

  @route('/api/item/:id')
  @GET()
  @before([validate(v.get)])
  async get(ctx) {
    const result = await this.store.findByIdOrSlug(ctx.params.id);
    ctx.assert(result, 404, `entity ${ctx.params.id} not found!`, {
      message: `entity ${ctx.params.id} not found!`,
    });
    ctx.ok({ status: 200, message: 'found', result });
  }
}
