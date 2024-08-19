import { route, GET, POST, PUT, before } from 'awilix-koa';
import passport from 'koa-passport';
import rules from '../lib/roles';
import { ADMIN_SCOPE } from '../models/mongo/setting';

@route('/api/config')
export default class ConfigurationApi {
  constructor({ logger, configurationService }) {
    this.logger = logger;
    this.configurationService = configurationService;
  }

  @GET()
  async getConfig(ctx) {
    const sections = await this.configurationService.all(['scope_public']);
    ctx.ok({ status: 200, message: 'config', sections });
  }

  @route('/:section')
  @GET()
  async getSection(ctx) {
    const section = await this.configurationService.getSection(
      ctx.params.section,
      ['scope_public']
    );
    ctx.ok({ status: 200, message: 'config_section', section });
  }

  @route('/:section/:field')
  @GET()
  async getField(ctx) {
    const field = await this.configurationService.getField(
      ctx.params.section,
      ctx.params.field,
      [ADMIN_SCOPE]
    );
    ctx.ok({ status: 200, message: 'config_field', field });
  }

  @route('/:section/:field')
  @POST()
  @before([
    passport.authenticate('jwt', { session: false }),
    rules.can('manage configurations'),
  ])
  async post(ctx) {
    let section = await this.configurationService.createOrUpdate(
      ctx.params.section,
      ctx.params.field,
      ctx.request.body
    );

    const field = await this.configurationService.getField(section, field);

    ctx.ok({ status: 200, message: 'config_set', field, section });
  }

  @route('/:section/:field')
  @PUT()
  @before([
    passport.authenticate('jwt', { session: false }),
    rules.can('manage configurations'),
  ])
  async put(ctx) {
    let section = await this.configurationService.createOrUpdate(
      ctx.params.section,
      ctx.params.field,
      ctx.request.body
    );
    const field = await this.configurationService.getField(
      ctx.params.section,
      ctx.params.field
    );
    ctx.ok({ status: 200, message: 'updated', field, section });
  }
}
