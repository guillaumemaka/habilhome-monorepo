import { route, GET, POST, PUT, DELETE, before } from 'awilix-koa';
import passport from 'koa-passport';
import { v } from '../lib/validations/search-validations';
import validate from 'koa2-validation';
import * as Utils from '../lib/utils';

@route('/api/objects')
export default class ObjectApi {
  constructor({ logger, objectSearchService, objectStore }) {
    this.logger = logger;
    this.searchService = objectSearchService;
    this.objectStore = objectStore;
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

      ctx.body = await this.objectStore.find(conditions, options);
    }
  }

  @route('/:id')
  @GET()
  @before([validate(v.get)])
  async get(ctx) {
    const result = await this.objectStore.findByIdOrSlug(ctx.params.id);
    ctx.assert(result, 404, `object ${ctx.params.id} not found!`, {
      message: `object ${ctx.params.id} not found!`,
    });
    ctx.ok({ status: 200, message: 'found', result });
  }

  @POST()
  @before([passport.authenticate('jwt', { session: false })])
  async post(ctx) {
    const result = await this.objectStore.create(ctx.request.body);
    ctx.assert(result, 400);
    ctx.set('Location', `/api/objects/${result.id}`);
    ctx.created({ status: 201, message: 'created', result });
  }

  @route('/:id')
  @PUT()
  @before([passport.authenticate('jwt', { session: false })])
  async put(ctx) {
    const doc = await this.objectStore.get(ctx.params.id);
    ctx.assert(doc, 404, `object ${ctx.params.id} not found!`, {
      message: 'not_found',
    });
    const result = await this.objectStore.update(
      ctx.params.id,
      ctx.request.body
    );
    ctx.ok({ status: 200, message: 'restored', result });
  }

  @route('/:id/restore')
  @PUT()
  @before([passport.authenticate('jwt', { session: false })])
  async restore(ctx) {
    const doc = await this.objectStore.get(ctx.params.id);
    ctx.assert(doc, 404, `object ${ctx.params.id} not found!`, {
      message: 'not_found',
    });
    const result = await this.objectStore.update(
      ctx.params.id,
      ctx.request.body
    );
    ctx.ok({ status: 200, message: 'restored', result });
  }

  @route('/:id')
  @DELETE()
  @before([passport.authenticate('jwt', { session: false })])
  async delete(ctx) {
    const doc = await this.objectStore.get(ctx.params.id);
    ctx.assert(doc, 404, `object ${ctx.params.id} not found!`, {
      message: `object ${ctx.params.id} not found!`,
    });
    const result = await this.objectStore.delete(ctx.params.id, ctx.query);
    ctx.ok({ status: 200, message: 'deleted', result });
  }
}
