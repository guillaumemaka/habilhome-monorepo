import { route, GET } from 'awilix-koa';
import mongoose from 'mongoose';
// import { NatsError } from "nats";
@route('/api/health')
export default class HealthApi {
  constructor({ logger }) {
    this.logger = logger;
  }

  @GET()
  async health(ctx) {
    const data = {
      meta: {
        ips: ctx.ips,
        ip: ctx.ip,
        host: ctx.host,
        hostname: ctx.hostname,
        headers: ctx.headers,
      },
      services: {
        db: {
          state: mongoose.STATES[mongoose.connection.readyState],
        },
      },
    };

    ctx.ok({ status: 200, message: 'health', data });
  }
}
