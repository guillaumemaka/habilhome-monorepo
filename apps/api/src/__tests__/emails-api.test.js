import { apiHelper } from './api-helper';
import AWS from 'aws-sdk';

jest.genMockFromModule('aws-sdk');
jest.mock('aws-sdk');

const promiseMock = jest.fn().mockResolvedValue(true);

const mockCallback = (message, cb) => {
  cb(null, { message });
  return {
    promise: promiseMock,
  };
};

const sendMessageMock = jest.fn(mockCallback);

AWS.SQS = jest.fn(() => {
  return {
    sendMessage: sendMessageMock,
  };
});

let request;

describe('EmailApi', () => {
  beforeAll(async (done) => {
    const api = await apiHelper();
    request = api.request;
    // createAndExposeQueue(done);
    return done();
  });

  it('should send a SQS message and return status code 200.', async (done) => {
    const body = {
      from: 'person@example.com',
      fullName: 'John Doe',
      message: 'test',
    };

    const sqsMessageBody = {
      locals: body,
      template: 'contact',
    };

    process.env.QUEUE_URL = 'http://localhost/00000/SendEmail';

    await request
      .post('/api/email')
      .send(body)
      .expect(200, { status: 200, message: 'email_sent' });

    const expectedSQSMessage = {
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify(sqsMessageBody),
    };

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock.mock.calls[0][0]).toStrictEqual(expectedSQSMessage);

    return done();
  });

  it('validation failed and return status code 422.', async () => {
    return request.post('/api/email').expect(422);
  });
});
