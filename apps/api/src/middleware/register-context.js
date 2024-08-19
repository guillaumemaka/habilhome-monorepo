import { asValue } from 'awilix';

/**
 * Register Context helps to add request-specific data to the scope.
 * Imagine some auth middleware somewhere...
 */
export async function registerContext(ctx, next) {
  ctx.state.container.register({
    currentUser: asValue(ctx.state.user),
  });
  return next();
}
