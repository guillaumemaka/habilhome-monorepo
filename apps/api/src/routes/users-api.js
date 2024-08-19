import { route, GET, POST, PUT, DELETE, before } from 'awilix-koa';
import passport from 'koa-passport';
import validate from 'koa2-validation';
import { v } from '../lib/validations/search-validations';
import { v as vAuth } from '../lib/validations/auth-validations';
import * as Utils from '../lib/utils';
import rules from '../lib/roles';
import { omit } from 'lodash';

@route('/api/users')
@before([
  passport.authenticate('jwt', { session: false }),
  rules.can('manage users'),
])
export default class UserApi {
  constructor({ logger, userStore }) {
    this.logger = logger;
    this.userStore = userStore;
  }

  @GET()
  @before([validate(v.index)])
  async find(ctx) {
    const { q } = ctx.query;
    const conditions = {};
    const { active, deleted } = ctx.query;

    ctx.query.select = { password: 0 };

    if (ctx.query.sort) {
      ctx.query.sort = Utils.transformSort(ctx.query.sort);
    }

    if (q) {
      conditions.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
      delete ctx.query.q;
    }

    if (deleted) {
      conditions.deletedAt = { $ne: null };
      delete ctx.query.deleted;
    }

    if (active) {
      conditions.active = { $eq: active };
      delete ctx.query.active;
    }

    const results = await this.userStore.find(conditions, ctx.query);
    ctx.ok({ status: 200, message: 'search', ...results });
  }

  @route('/:id')
  @GET()
  @before([validate(v.get)])
  async get(ctx) {
    const result = await this.userStore.get(ctx.params.id);

    ctx.assert(result, 404, `user ${ctx.params.id} not found!`, {
      message: `user ${ctx.params.id} not found!`,
    });
    ctx.ok({ status: 200, message: 'found', result: omit(result, ['token']) });
  }

  @POST()
  @before([validate(vAuth.Signup)])
  async post(ctx) {
    const exist = await this.userStore.findOne({
      email: ctx.request.body.email,
    });
    ctx.assert(exist === null, 400, 'User already exist', {
      message: 'user_already_exist',
    });
    const user = await this.userStore.create(ctx.request.body);
    ctx.assert(user, 400);
    ctx.set('Location', `/api/users/${user.id}`);
    ctx.created({ status: 201, message: 'user_created', user });
  }

  @route('/:id')
  @PUT()
  @before([validate(vAuth.UserUpdate)])
  async put(ctx) {
    const doc = await this.userStore.get(ctx.params.id);
    ctx.assert(doc, 404, `user ${ctx.params.id} not found!`, {
      message: `user ${ctx.params.id} not found!`,
    });
    const user = await this.userStore.update(
      ctx.params.id,
      omit(ctx.request.body, [
        'createdAt',
        'deletedAt',
        'updatedAt',
        '_id',
        'id',
      ])
    );
    ctx.ok({ status: 200, message: 'user_updated', user });
  }

  @route('/:id')
  @DELETE()
  async delete(ctx) {
    const doc = await this.userStore.get(ctx.params.id);
    ctx.assert(doc, 404, `user ${ctx.params.id} not found!`, {
      message: `user ${ctx.params.id} not found!`,
    });
    await this.userStore.delete(ctx.params.id);
    ctx.ok({ status: 200, message: 'user_deleted' });
  }
}
