import Roles from 'koa-roles';

const rules = new Roles({
  async failureHandler(ctx, action) {
    ctx.status = 403;
    ctx.body = { status: 403, message: 'access_forbidden', action };
  },
});

rules.use('manage users', (ctx) => {
  if (ctx.state.user && ctx.state.user.roles.indexOf('admin') !== -1) {
    return true;
  }

  return false;
});

rules.use('manage configurations', (ctx) => {
  if (ctx.state.user && ctx.state.user.roles.indexOf('admin') !== -1) {
    return true;
  }

  return false;
});

rules.use('manage reports', (ctx) => {
  if (ctx.state.user && ctx.state.user.roles.indexOf('admin') !== -1) {
    return true;
  }

  return false;
});

export default rules;
