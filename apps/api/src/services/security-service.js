import jwt, { TokenExpiredError } from 'jsonwebtoken';
import * as url from 'url';
import AWS from 'aws-sdk';

const defaultExpiration = process.env.DEFAULT_RESET_PWD_EXPIRATION || '2 days';
const defaultIssuer = process.env.DEFAULT_JWT_ISSUER || 'habilome-api';
const adminDomain =
  process.env.ADMIN_DOMAIN_ADDRESS || 'http://vt-admin.localhost:9080';

export const ResetPasswordWindowExpired = 'reset_password_window_expired';
export const PasswordMissmatch = 'password_missmatch';
export const UserNotFound = 'user_not_found';
export const PasswordChanged = 'password_changed';
export const EmailSent = 'email_sent';
export const SqsError = 'sqs_error';
export const JwtError = 'jwt_error';
export const JwtTokenExpired = 'jwt_token_expired';

export const Messages = {
  reset_password_window_expired: 'reset password window expired!',
  password_missmatch: 'password missmatch',
  user_not_found: 'user not found',
  password_changed: 'password changed',
  email_sent: 'email reset password instruction sent',
  jwt_token_expired: 'jwt expired',
};

export default class SecurityService {
  constructor({ logger, userStore, configurationService }) {
    this.logger = logger;
    this.userStore = userStore;
    this.configurationService = configurationService;
    this.sqs = new AWS.SQS();
  }

  /**
   *
   * @typedef {Object} ResetPasswordDto
   * @property {string} token a valid token
   * @property {string} password new password
   * @property {string} passwordConfirm password confirmation
   */

  /**
   *
   * @typedef {Object} SecurityServiceResponse
   * @property {string} code response code
   * @property {string} message response message
   */

  /**
   * Reset password
   * @param {ResetPasswordDto} dto reset password dto
   * @returns {SecurityServiceResponse}
   */
  async resetPassword(dto) {
    const { token, password, passwordConfirm } = dto;
    let decoded = undefined;
    try {
      decoded = this.verifyToken(token);
    } catch (error) {
      this.logger.error(error.message, { error });

      if (error instanceof TokenExpiredError) {
        return {
          code: ResetPasswordWindowExpired,
          message: Messages[ResetPasswordWindowExpired],
        };
      } else {
        return {
          code: JwtError,
          message: error.message,
        };
      }
    }

    const { email } = decoded;

    if (password !== passwordConfirm) {
      return { code: PasswordMissmatch, message: Messages[PasswordMissmatch] };
    }

    const user = await this.userStore.findOne({ email });

    if (!user) {
      return {
        code: UserNotFound,
        message: Messages[UserNotFound],
      };
    }

    user.setPassword(password);
    await user.save();

    return { code: PasswordChanged, message: Messages[PasswordChanged] };
  }

  /**
   *
   * @typedef {Object} ForgotPasswordDto
   * @property {string?} email a valid token
   */

  /**
   * Send reset password instructions
   * @param {ForgotPasswordDto} dto forgot password dto
   * @returns {SecurityServiceResponse}
   */
  async forgotPassword(dto = {}) {
    let { email } = dto;
    let useFallback = false;

    if (email) {
      if (!(await this.userStore.exists({ email }))) {
        return { code: UserNotFound, message: Messages[UserNotFound] };
      }
    }

    if (!email) {
      const field = await this.configurationService.getField(
        'general',
        'email'
      );
      if (!field) {
        email = process.env.FALLBACK_EMAIL_ADDRESS;
        useFallback = true;
      } else {
        email = field.value;
      }
    }

    const token = this.generateToken({ email });
    const urlVerification = new url.URL(
      `/resetpassword?token=${token}`,
      adminDomain
    );

    const messageBody = JSON.stringify({
      locals: {
        to: email,
        urlVerification,
        useFallback,
      },
      template: 'reset-password',
    });

    return this.sendEmail(messageBody);
  }
  async sendEmail(messageBody) {
    try {
      const data = await this.sqs
        .sendMessage({
          QueueUrl: process.env.QUEUE_URL,
          MessageBody: messageBody,
        })
        .promise();

      this.logger.info('Message sent!', {
        data,
      });

      return { code: EmailSent, message: Messages[EmailSent], data };
    } catch (error) {
      this.logger.error(error.message, {
        error,
      });
      return { code: SqsError, message: error.message };
    }
  }

  generateToken(claim, options = {}) {
    return jwt.sign(claim, process.env.JWT_SECRET, {
      expiresIn: defaultExpiration,
      audience: 'admin.habilhome.com',
      issuer: defaultIssuer,
      ...options,
    });
  }

  verifyToken(token, options = {}) {
    return jwt.verify(token, process.env.JWT_SECRET, {
      ...options,
      issuer: defaultIssuer,
      audience: 'admin.habilhome.com',
    });
  }
}
