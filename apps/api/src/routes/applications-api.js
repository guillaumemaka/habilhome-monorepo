import { route, GET, POST, PUT, DELETE, before } from 'awilix-koa';
import passport from 'koa-passport';
import validate from 'koa2-validation';
import { v } from '../lib/validations/search-validations';
import * as Utils from '../lib/utils';

@route('/api/applications')
export default class ApplicationApi {
  constructor({ logger, applicationSearchService, applicationStore }) {
    this.logger = logger;
    this.searchService = applicationSearchService;
    this.applicationStore = applicationStore;
  }

  @GET()
  @before([validate(v.index)])
  async find(ctx) {
    let { offset, page = 1, limit = 25, sort } = ctx.query;

    if (sort) {
      sort = Utils.transformSort(ctx.query.sort);
    } else {
      sort = { name: 1 };
    }

    const options = { sort, page, limit, offset };

    if (options.page != undefined) {
      delete options['offset'];
    }

    if (options.offset != undefined) {
      delete options['page'];
    }

    this.logger.debug(options);

    if (ctx.query.q) {
      ctx.body = await this.searchService.search(ctx.query.q, options);
    } else {
      const { withDraft, withTrash } = ctx.query;
      const conditions = {};

      if (withTrash) {
        conditions.deletedAt = { $ne: null };
      }

      if (withDraft !== undefined) {
        conditions.draft = { $eq: withDraft };
      }

      ctx.body = await this.applicationStore.find(conditions, options);
    }
  }

  @route('/:id')
  @GET()
  @before([validate(v.get)])
  async get(ctx) {
    const result = await this.applicationStore.findByIdOrSlug(ctx.params.id);
    ctx.assert(result, 404, `application ${ctx.params.id} not found!`, {
      message: `application ${ctx.params.id} not found!`,
    });
    ctx.ok({ status: 200, message: 'found', result });
  }

  @POST()
  @before([passport.authenticate('jwt', { session: false })])
  async post(ctx) {
    const result = await this.applicationStore.create(ctx.request.body);
    ctx.assert(result, 400);
    ctx.set('Location', `/api/applications/${result.id}`);
    ctx.created({ status: 200, message: 'created', result });
  }

  @route('/:id')
  @PUT()
  @before([passport.authenticate('jwt', { session: false })])
  async put(ctx) {
    const doc = await this.applicationStore.get(ctx.params.id);
    ctx.assert(doc, 404, `application ${ctx.params.id} not found!`, {
      message: `application ${ctx.params.id} not found!`,
    });

    const result = await this.applicationStore.update(
      ctx.params.id,
      ctx.request.body
    );
    ctx.ok({ status: 200, message: 'updated', result });
  }

  @route('/:id/restore')
  @PUT()
  @before([passport.authenticate('jwt', { session: false })])
  async restore(ctx) {
    const doc = await this.applicationStore.get(ctx.params.id);
    ctx.assert(doc, 404, `application ${ctx.params.id} not found!`, {
      message: `application ${ctx.params.id} not found!`,
    });
    const result = await this.applicationStore.restore(ctx.params.id);
    ctx.ok({ status: 200, message: 'restored', result });
  }

  @route('/:id')
  @DELETE()
  @before([passport.authenticate('jwt', { session: false })])
  async delete(ctx) {
    const doc = await this.applicationStore.get(ctx.params.id);
    ctx.assert(doc, 404, `application ${ctx.params.id} not found!`, {
      message: `application ${ctx.params.id} not found!`,
    });
    const result = await this.applicationStore.delete(ctx.params.id, ctx.query);
    ctx.ok({ status: 200, message: 'deleted', result });
  }
}
