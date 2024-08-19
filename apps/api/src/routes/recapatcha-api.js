import { route, POST } from 'awilix-koa';
import axios from 'axios';

export default class StatsApi {
  constructor({ statsService, logger }) {
    this.statsService = statsService;
    this.logger = logger;
  }

  @route('/api/google/recaptcha/verify_token')
  @POST()
  async googleRecaptchaVerifyToken(ctx) {
    const { token } = ctx.request.body;

    ctx.assert(token, 422, 'No token provided', {
      message: 'No token provided',
    });

    const payload = {
      response: token,
      secret: process.env.GOOGLE_RECAPTCHA_SECRET,
    };

    if (ctx.ip) {
      payload.remoteip = ctx.ip;
    }

    try {
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        { params: payload }
      );
      ctx.ok({ ...response.data });
    } catch (err) {
      this.logger.error('reCaptcha verification error', { error: err });
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
    }
  }
}
