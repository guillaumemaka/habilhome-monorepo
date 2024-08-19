import User from '../models/mongo/user';
import { apiHelper, createContainer } from './api-helper';
import {
  EmailSent,
  JwtError,
  JwtTokenExpired,
  Messages,
  PasswordChanged,
  ResetPasswordWindowExpired,
  UserNotFound,
} from '../services/security-service';
import AWS from 'aws-sdk';

jest.genMockFromModule('aws-sdk');
jest.mock('aws-sdk');

const promiseMock = jest.fn().mockResolvedValue(true);

const sendMessageMock = jest.fn(() => {
  return {
    promise: promiseMock,
  };
});

AWS.SQS = jest.fn(() => {
  return {
    sendMessage: sendMessageMock,
  };
});

let request;
let container;

describe('SecurityApi', () => {
  beforeAll(async (done) => {
    await User.deleteMany({});
    const api = await apiHelper();
    container = createContainer();
    request = api.request;
    return done();
  });

  describe('Validations', () => {
    it('POST /api/security/forgotpassword / invalid email -- should return 400 status code', () => {
      return request
        .post('/api/security/forgotpassword')
        .send({ email: 'example.com' })
        .expect(422);
    });

    it('GET /api/security/resetpassword/verify_email / no token -- should return 422 status code', () => {
      return request
        .get('/api/security/resetpassword/verify_email')
        .expect(422);
    });

    it('GET /api/security/resetpassword/verify_email / invalid token format -- should return 400 status code', async (done) => {
      const {
        body: { code, message },
      } = await request
        .get('/api/security/resetpassword/verify_email')
        .query({ token: 'xxx.xxx.xxx.xx.xxx.x' })
        .expect(400);

      expect(code).toBe(JwtError);
      expect(message).toBe('jwt malformed');

      return done();
    });

    it('GET /api/security/resetpassword/verify_email / token expired -- should return 400 status code', (done) => {
      const token = container.cradle.securityService.generateToken(
        { email: 'test@example.com' },
        { expiresIn: '1s' }
      );

      setTimeout(async () => {
        const {
          body: { code, message },
        } = await request
          .get('/api/security/resetpassword/verify_email')
          .query({ token })
          .expect(400);

        expect(code).toBe(JwtTokenExpired);
        expect(message).toBe(Messages[JwtTokenExpired]);
        return done();
      }, 2000);
    });

    it('GET /api/security/resetpassword/verify_email / valid token -- should return 200 status code and a reset password token', async (done) => {
      const email = 'user1@example.com';
      await container.cradle.userStore.create({
        active: true,
        email,
        password: 'P@ssw0rd',
      });

      const token = container.cradle.securityService.generateToken({ email });

      const {
        body: { resetPasswordToken },
      } = await request
        .get('/api/security/resetpassword/verify_email')
        .query({ token })
        .expect(200);

      expect(resetPasswordToken).toBeDefined();
      expect(
        container.cradle.securityService.verifyToken(resetPasswordToken).email
      ).toBe(email);

      return done();
    });

    it('password missmatch -- should hit joi validation and return 422 status code', async (done) => {
      const email = 'test_password_missmatch@example.com';

      await container.cradle.userStore.create({
        active: true,
        email,
        password: 'P@ssw0rd',
      });

      const token = container.cradle.securityService.generateToken({ email });
      const payload = {
        token,
        password: '12345678',
        passwordConfirm: '12345678_',
      };

      const {
        body: { message, errors },
      } = await request
        .post('/api/security/resetpassword')
        .send(payload)
        .expect(422);

      const user = await container.cradle.userStore.findOne({ email });

      expect(user.checkPassword('P@ssw0rd')).toBeTruthy();
      expect(message).toBe('validations_error');
      expect(errors).toBeDefined();
      expect(errors[0].passwordConfirm).toBeDefined();

      return done();
    });
  });

  describe('POST /api/resetpassword', () => {
    it('expired token -- should not reset password andreturn 400 status code', async (done) => {
      const email = 'test_expired_token@example.com';

      await container.cradle.userStore.create({
        active: true,
        email,
        password: 'P@ssw0rd',
      });

      const token = container.cradle.securityService.generateToken(
        { email },
        { expiresIn: '1s' }
      );
      const payload = {
        token,
        password: '12345678',
        passwordConfirm: '12345678',
      };
      setTimeout(async () => {
        const {
          body: { code, message },
        } = await request
          .post('/api/security/resetpassword')
          .send(payload)
          .expect(400);

        expect(code).toBe(ResetPasswordWindowExpired);
        expect(message).toBe(Messages[ResetPasswordWindowExpired]);

        return done();
      }, 2000);
    });

    it('valid token -- should reset password and return 200 status code', async (done) => {
      const email = 'test_valid_token@example.com';

      await container.cradle.userStore.create({
        active: true,
        email,
        password: 'P@ssw0rd',
      });

      const token = container.cradle.securityService.generateToken({ email });
      const payload = {
        token,
        password: '12345678',
        passwordConfirm: '12345678',
      };

      const {
        body: { code, message },
      } = await request
        .post('/api/security/resetpassword')
        .send(payload)
        .expect(200);

      const user = await container.cradle.userStore.findOne({ email });

      expect(user.checkPassword(payload.password)).toBeTruthy();
      expect(code).toBe(PasswordChanged);
      expect(message).toBe(Messages[PasswordChanged]);

      return done();
    });
  });

  describe('POST /api/security/forgotpassword', () => {
    it('valid email -- should return 200 status code', async () => {
      await container.cradle.userStore.create({
        active: true,
        email: 'user@example.com',
        password: 'P@ssw0rd',
      });

      return request
        .post('/api/security/forgotpassword')
        .send({ email: 'user@example.com' })
        .expect(200, {
          status: 200,
          code: EmailSent,
          message: Messages[EmailSent],
        });
    });

    it('email not found -- should return 404 status code', () => {
      return request
        .post('/api/security/forgotpassword')
        .send({ email: 'notfound@example.com' })
        .expect(404, {
          status: 404,
          code: UserNotFound,
          message: Messages[UserNotFound],
        });
    });

    it('no email provided -- should return 200 status code and send to admin', async (done) => {
      await container.cradle.startupService.init();
      await request.post('/api/security/forgotpassword').send({}).expect(200, {
        status: 200,
        code: EmailSent,
        message: Messages[EmailSent],
      });
      return done();
    });
  });
});
