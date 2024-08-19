/* eslint-disable no-console */
import { logger } from '../lib/logger';

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
export async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    logger.error(err);

    /* ko2-validation */
    /* istanbul ignore next */
    ctx.state.container.cradle.logger.debug({ ...err });
    if (err.errors) {
      err.status = 422;
      err.message = 'validations_error';
      if (err.errors) {
        err.errors = err.errors.map((err) => {
          return {
            [err.path[0]]: err.message,
          };
        });
      }
    }

    ctx.status = err.status || err.statusCode || 500;

    /* istanbul ignore next */

    ctx.body = {
      ...err,
      status: err.status,
      message: err.message,
      ...(err.code ? { code: err.code } : {}),
    };
    // ctx.body = err.toJSON
    //   ? err.toJSON()
    //   : { ...err, status: err.status, message: err.message, code: err.code };
    /* istanbul ignore next */
    // eslint-disable-next-line no-undef
    if (!process.env.EMIT_STACK_TRACE) {
      delete ctx.body.stack;
    }

    ctx.app.emit('error', err, ctx);
  }
}
