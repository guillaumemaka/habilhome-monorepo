import passport from 'koa-passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { asValue } from 'awilix';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(jwtOptions, async ({ ctx }, { email }, cb) => {
    const { authService, logger } = ctx.state.container.cradle;
    try {
      const user = await authService.loadUserByEmail(email);

      ctx.state.container.register({ currentUser: asValue(user) });

      if (!user) {
        cb(null, false);
      } else {
        cb(null, user);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  })
);
