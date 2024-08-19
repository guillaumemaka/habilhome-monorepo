import { route, GET, before } from 'awilix-koa';
import passport from 'koa-passport';

@route('/api/stats')
@before([passport.authenticate('jwt', { session: false })])
export default class StatsApi {
  constructor({ statsService }) {
    this.statsService = statsService;
  }

  @GET()
  async stats(ctx) {
    const stats = await this.statsService.getStats();
    ctx.ok({ status: 200, message: 'stats', stats });
  }
}
