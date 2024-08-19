import { route, POST, before } from 'awilix-koa';
import { v } from '../lib/validations/email-validations';
import validate from 'koa2-validation';
import { SettingModel } from '../models/mongo';
import AWS from 'aws-sdk';

@route('/api/email')
export default class EmailApi {
  constructor({ logger, emailTemplateConfig }) {
    this.logger = logger;
    this.emailTemplateConfig = emailTemplateConfig;
  }

  @POST()
  @before([validate(v.post)])
  async post(ctx) {
    return this.sendMail(ctx, ctx.request.body);
  }

  async sendMail(ctx, message) {
    const messageBody = JSON.stringify({
      locals: message,
      template: 'contact',
    });
    const sqs = new AWS.SQS();

    return sqs
      .sendMessage(
        {
          QueueUrl: process.env.QUEUE_URL,
          MessageBody: messageBody,
        },
        (error, data) => {
          if (error) {
            this.logger.error(error.message, {
              error,
            });
            ctx.badRequest({
              status: 400,
              message: 'email_sent_error',
            });
          } else {
            this.logger.info('Message sent!', {
              data,
            });
            ctx.ok({ status: 200, message: 'email_sent' });
          }
        }
      )
      .promise();
  }

  async queryField(section, field) {
    const results = await SettingModel.aggregate([
      {
        $match: {
          section: section,
        },
      },
      {
        $unwind: {
          path: '$fields',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'fields.name': field,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$fields',
        },
      },
    ]);

    return results.length > 0 ? results[0] : {};
  }
}
