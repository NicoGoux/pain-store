import dotenv from 'dotenv';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import cLog from '../../../utils/cLog.js';

dotenv.config();

const jwtStrategy = new Strategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SEC,
	},
	(payload, done) => {
		cLog.yellow(`[passport] ${payload.sub} logged by jwt`);
		return done(null, payload);
	}
);

export { jwtStrategy };
