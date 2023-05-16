import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { UserService } from '../../../services/user/user.service.js';
import cLog from '../../../utils/cLog.js';

const userService = UserService.getInstance();

const localStrategy = new Strategy({ usernameField: 'email' }, async (email, password, done) => {
	try {
		const user = await userService.loginUserByEmail(email, password);
		cLog.yellow(`[passport] ${user.email} logged by email`);
		done(null, user);
	} catch (error) {
		return done(error, false);
	}
});

export { localStrategy };
