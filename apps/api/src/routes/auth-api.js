import { route, before, POST } from 'awilix-koa';
import validate from 'koa2-validation';
import { v } from '../lib/validations/auth-validations';
@route('/api/auth')
export default class AuthApi {
  constructor({ authService }) {
    this.authService = authService;
  }

  @route('/signin')
  @POST()
  @before([validate(v.Signin)])
  async signin(ctx) {
    try {
      const { email, password } = ctx.request.body;
      const user = await this.authService.loadUserByEmail(email);

      ctx.assert(user, 400, 'email or password invalid!', {
        message: 'email or password invalid!',
      });
      ctx.assert(
        user.checkPassword(password) && user.active,
        400,
        'email or password invalid!',
        { message: 'email or password invalid!' }
      );

      const json = user.toJSON();
      ctx.ok({ status: 200, ...json });
    } catch (err) {
      if (err.name == 'MongoError' && err.code === 11000) {
        ctx.badRequest({ status: 400, message: 'user already exist!' });
      }

      throw err;
    }
  }
}
