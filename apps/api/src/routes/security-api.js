import { route, before, POST, GET } from 'awilix-koa';
import {
  EmailSent,
  JwtError,
  JwtTokenExpired,
  UserNotFound,
  PasswordChanged,
} from '../services/security-service';
import validate from 'koa2-validation';
import { v } from '../lib/validations/security-validations';

@route('/api/security')
export default class SecurityApi {
  constructor({ logger, securityService }) {
    this.securityService = securityService;
    this.logger = logger;
  }

  @route('/forgotpassword')
  @POST()
  @before([validate(v.ForgotPassword)])
  async forgotPassword(ctx) {
    const { email } = ctx.request.body;
    const { code, message } = await this.securityService.forgotPassword({
      email,
    });

    const errStatus = code === UserNotFound ? 404 : 400;

    ctx.assert(code === EmailSent, errStatus, message, {
      status: errStatus,
      code,
      message,
    });
    ctx.ok({ status: 200, code, message });
  }

  @route('/resetpassword/verify_email')
  @GET()
  @before([validate(v.EmailVerificationToken)])
  async resetPasswordVerifyEmail(ctx) {
    try {
      const { token } = ctx.request.query;

      const { email } = this.securityService.verifyToken(token);
      const resetPasswordToken = this.securityService.generateToken(
        { email },
        { expiresIn: '15 minutes' }
      );

      ctx.ok({ status: 200, resetPasswordToken });
    } catch (err) {
      if (err.name && err.name === 'TokenExpiredError') {
        return ctx.badRequest({
          status: 400,
          message: err.message,
          code: JwtTokenExpired,
        });
      } else if (err.name && err.name === 'JsonWebTokenError') {
        return ctx.badRequest({
          status: 400,
          message: err.message,
          code: JwtError,
        });
      } else {
        throw err;
      }
    }
  }

  @route('/resetpassword')
  @POST()
  @before([validate(v.ResetPassword)])
  async resetPassword(ctx) {
    const { token, password, passwordConfirm } = ctx.request.body;
    const { code, message } = await this.securityService.resetPassword({
      token,
      password,
      passwordConfirm,
    });
    ctx.assert(code === PasswordChanged, 400, message, { code, message });
    ctx.ok({ status: 200, code, message });
  }
}
