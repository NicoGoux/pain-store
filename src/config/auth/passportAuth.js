import passport from 'passport';
import { localStrategy } from './strategies/local.strategy.js';
import { jwtStrategy } from './strategies/jwt.strategy.js';

passport.use(localStrategy);
passport.use(jwtStrategy);

const passportAuthLocal = passport.authenticate('local', { session: false });

const passportAuthJwt = passport.authenticate('jwt', { session: false });

export { passportAuthLocal, passportAuthJwt };
