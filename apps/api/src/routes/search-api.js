import { route, POST, before } from 'awilix-koa';
import validate from 'koa2-validation';
import { v } from '../lib/validations/search-validations';

@route('/api/search')
export default class SearchApi {
  constructor({ logger, abstractModelStore, domainModelSearchService }) {
    this.logger = logger;
    this.abstractModelStore = abstractModelStore;
    this.searchService = domainModelSearchService;
  }

  @POST()
  @before([validate(v.search)])
  async post(ctx) {
    const { aggregate, query, options } = ctx.request.body;
    if (aggregate && aggregate.q) {
      let results = await this.searchService.aggregate(
        aggregate.q,
        options.page || 1,
        options.limit || process.env.PER_PAGE || 25
      );
      results = results.length > 0 ? results[0] : [];
      ctx.ok({ status: 200, message: 'search', ...results });
    } else if (query) {
      const results = await this.abstractModelStore.find(query, options);
      ctx.ok({ status: 200, message: 'search', ...results });
    } else {
      ctx.badRequest({ status: 400, message: 'invalid_payload' });
    }
  }
}
