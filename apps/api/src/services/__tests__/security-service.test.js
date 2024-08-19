import { createContainer } from '../../__tests__/api-helper';
import { SettingModel, UserModel } from '../../models/mongo';
import {
  JwtError,
  Messages,
  PasswordMissmatch,
  PasswordChanged,
  ResetPasswordWindowExpired,
  SqsError,
  UserNotFound,
} from '../security-service';
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

let container;
let securityService;

describe('SecurityService', () => {
  beforeAll(async (done) => {
    await UserModel.deleteMany({});
    container = createContainer();
    securityService = container.cradle.securityService;

    process.env.QUEUE_URL = 'TestQueue';
    // createAndExposeQueue(done);
    return done();
  });

  it('securityService -- should be available in container', () => {
    expect(container.has('configurationService')).toBeTruthy();
    expect(container.has('securityService')).toBeTruthy();
    expect(securityService).toBeDefined();
  });

  describe('forgotPassword()', () => {
    it('forgotPassword({email}) - should send a verification email successfully', async (done) => {
      const email = 'person@example.com';

      await container.cradle.userStore.create({
        firstName: 'person',
        lastName: 'example',
        email,
        password: 'P@ssw0rd',
        active: true,
        roles: ['user', 'admin'],
      });

      const expectedCalledWith = {
        QueueUrl: 'TestQueue',
        MessageBody: JSON.stringify({
          locals: {
            to: email,
            urlVerification: `http://vt-admin.localhost:9080/resetpassword?token=${securityService.generateToken(
              { email }
            )}`,
            useFallback: false,
          },
          template: 'reset-password',
        }),
      };

      await securityService.forgotPassword({ email });

      expect(sendMessageMock).toHaveBeenLastCalledWith(expectedCalledWith);

      return done();
    });

    it('forgotPassword() - should send a verification email successfully to the default admin email', async (done) => {
      await container.cradle.startupService.init();
      const email = 'domotique.uqtr@gmail.com';
      const expectedCalledWith = {
        QueueUrl: 'TestQueue',
        MessageBody: JSON.stringify({
          locals: {
            to: email,
            urlVerification: `http://vt-admin.localhost:9080/resetpassword?token=${securityService.generateToken(
              { email }
            )}`,
            useFallback: false,
          },
          template: 'reset-password',
        }),
      };

      await securityService.forgotPassword();

      expect(sendMessageMock).toHaveBeenLastCalledWith(expectedCalledWith);

      return done();
    });

    it('forgotPassword(useFallback) - should send a verification email successfully to the fallback email', async (done) => {
      await SettingModel.deleteMany({});

      const email = process.env.FALLBACK_EMAIL_ADDRESS;

      const expectedCalledWith = {
        QueueUrl: 'TestQueue',
        MessageBody: JSON.stringify({
          locals: {
            to: email,
            urlVerification: `http://vt-admin.localhost:9080/resetpassword?token=${securityService.generateToken(
              { email }
            )}`,
            useFallback: true,
          },
          template: 'reset-password',
        }),
      };

      await securityService.forgotPassword();

      expect(sendMessageMock).toHaveBeenLastCalledWith(expectedCalledWith);

      return done();
    });

    it('forgotPassword() - should not send a verification email on user not found', async (done) => {
      const email = 'unknown@exanple.com';

      const { code, message } = await securityService.forgotPassword({ email });

      expect(code).toBe(UserNotFound);
      expect(message).toBe(Messages[UserNotFound]);
      expect(sendMessageMock).not.toHaveBeenCalled();

      return done();
    });

    it('forgotPassword() - sqs.sendMessage rejection', async (done) => {
      const errorMessage = 'sqs error';

      promiseMock.mockReset().mockRejectedValue(new Error(errorMessage));

      const error = await securityService.forgotPassword();

      expect(error).toBeDefined();
      expect(error.code).toBe(SqsError);
      expect(error.message).toBe(errorMessage);
      expect(sendMessageMock).toHaveBeenCalled();

      return done();
    });
  });

  describe('resetPassword()', () => {
    it('resetPassword(invalid_token) - should not reset password on invalid token', async (done) => {
      const token = 'xxxx.xxxx.xxx';
      const { code, message } = await securityService.resetPassword({ token });
      expect(code).toBe(JwtError);
      expect(message).toBe('invalid token');
      return done();
    });

    it('resetPassword(expired_token) - should not reset password on invalid token', async (done) => {
      const email = 'email@exanple.com';
      const token = securityService.generateToken(
        { email },
        { expiresIn: '1s' }
      );

      setTimeout(async () => {
        const { code, message } = await securityService.resetPassword({
          token,
        });
        expect(code).toBe(ResetPasswordWindowExpired);
        expect(message).toBe(Messages[ResetPasswordWindowExpired]);
        return done();
      }, 1000);
    });

    it('resetPassword() - should reset password on valid token', async (done) => {
      const setPasswordMock = jest.fn();
      const saveMock = jest.fn();
      const findOneMock = jest.fn(() => {
        return {
          setPassword: setPasswordMock,
          save: saveMock,
        };
      });

      jest.genMockFromModule('../../stores/user-store.js');
      jest.mock('../../stores/user-store.js');

      container.cradle.userStore.findOne = findOneMock;

      const email = 'email@exanple.com';
      const token = securityService.generateToken(
        { email },
        { expiresIn: '6s' }
      );
      const dto = { token, password: 1234, passwordConfirm: 1234 };
      const { code, message } = await securityService.resetPassword(dto);

      expect(code).toBe(PasswordChanged);
      expect(message).toBe(Messages[PasswordChanged]);
      expect(findOneMock).toHaveBeenLastCalledWith({ email });
      expect(setPasswordMock).toHaveBeenLastCalledWith(dto.password);
      expect(saveMock).toHaveBeenCalledTimes(1);
      return done();
    });

    it('resetPassword(password_missmatch) - should not reset password if password missmatch', async (done) => {
      const setPasswordMock = jest.fn();
      const saveMock = jest.fn();
      const findOneMock = jest.fn(() => {
        return {
          setPassword: setPasswordMock,
          save: saveMock,
        };
      });

      jest.genMockFromModule('../../stores/user-store.js');
      jest.mock('../../stores/user-store.js');

      container.cradle.userStore.findOne = findOneMock;

      const email = 'email@exanple.com';
      const token = securityService.generateToken(
        { email },
        { expiresIn: '6s' }
      );
      const dto = { token, password: 1234, passwordConfirm: 123456 };
      const { code, message } = await securityService.resetPassword(dto);
      expect(code).toBe(PasswordMissmatch);
      expect(message).toBe(Messages[PasswordMissmatch]);
      expect(findOneMock).not.toHaveBeenLastCalledWith({ email });
      expect(setPasswordMock).not.toHaveBeenLastCalledWith(dto.password);
      expect(saveMock).not.toHaveBeenCalledTimes(1);
      return done();
    });
  });
});
