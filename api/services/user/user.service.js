import bcrypt from 'bcrypt';
import { UserDAO } from '../../database/modelDAO/user/UserDAO.js';
import boom from '@hapi/boom';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/nodemailer.js';

let instance;

class UserService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new UserService();
		}
	}

	constructor() {
		this.userDAO = new UserDAO();
	}

	//#region  Register user
	registerUser(newUser) {
		const hash = bcrypt.hashSync(newUser.password, 10);
		return this.userDAO.createUser({ ...newUser, password: hash });
	}

	registerAdmin(newUser) {
		const hash = bcrypt.hashSync(newUser.password, 10);
		return this.userDAO.createUser({ ...newUser, role: 'ADMIN', password: hash });
	}
	//#endregion

	//#region Login user
	async loginUserByEmail(email, password) {
		const user = await this.userDAO.getUserByEmail(email);

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw boom.unauthorized('Incorrect password');
		}

		delete user._doc.password;
		return user;
	}
	//#endregion

	//#region confirm email
	async sendConfirmEmail(user) {
		try {
			const userFound = await this.userDAO.getUserById(user.sub);

			if (userFound.emailConfirm === true) {
				return { message: 'email confirmed' };
			}

			// Create email confirm token for the user
			const emailConfirmToken = jwt.sign(
				{
					sub: userFound.id,
				},
				process.env.JWT_SEC_CONFIRM_EMAIL,
				{ expiresIn: '15min' }
			);

			// Add token to the user
			const userUpdated = await this.userDAO.updateEmailConfirmToken(
				userFound.id,
				emailConfirmToken
			);

			// Check update
			if (userFound.emailConfirmToken == userUpdated.emailConfirmToken) {
				throw boom.conflict("Can't update confirmToken");
			}

			//TODO
			const link = `http://myfrontend.com/confirm-email?token=${emailConfirmToken}`;

			// email message
			const infoEmail = {
				from: process.env.EMAIL_USER, // sender address
				to: userFound.email, // list of receivers
				subject: 'Pain Store - Confirmar email', // Subject line
				html: `<h3>Hola, ${userFound.username}.</h3>
					<b>Sigue este <a href="${link}">link</a> para confirmar el email de la cuenta: ${userFound.email}.</b><br/><br/>
					<a href="${link}">${link}</a><br/><br/>
					<b>El link expirara en 15 minutos.</b>`, // html body
			};
			return await sendEmail(infoEmail);
		} catch (err) {
			// throw boom.conflict();
			throw boom.boomify(err, {
				message: 'unauthorized',
				statusCode: 409,
			});
		}
	}

	async confirmEmail(token) {
		try {
			const payload = jwt.verify(token, process.env.JWT_SEC_CONFIRM_EMAIL);
			const user = await this.userDAO.getUserById(payload.sub);
			if (user.emailConfirmToken != token) {
				throw boom.unauthorized();
			}

			const userUpdated = await this.userDAO.updateEmailConfirm(user.id);

			// Check update
			if (user.emailConfirm == userUpdated.emailConfirm) {
				throw boom.conflict("Can't confirm email");
			}

			return { message: 'Email confirmed' };
		} catch (err) {
			throw boom.unauthorized();
		}
	}
	//#endregion

	//#region password recovery
	async sendPasswordRecovery(email) {
		try {
			const user = await this.userDAO.getUserByEmail(email);

			// Create recovery password token for the user
			const recoveryToken = jwt.sign(
				{
					sub: user.id,
				},
				process.env.JWT_SEC_RECOVERY,
				{ expiresIn: '15min' }
			);

			// Add token to the user
			const userUpdated = await this.userDAO.updateRecoveryToken(user.id, recoveryToken);

			// Check update
			if (user.recoveryToken == userUpdated.recoveryToken) {
				throw boom.conflict("Can't update recoveryToken");
			}

			//TODO
			const link = `http://myfrontend.com/recovery?token=${recoveryToken}`;

			// email message
			const infoEmail = {
				from: process.env.EMAIL_USER, // sender address
				to: user.email, // list of receivers
				subject: 'Pain Store - Recuperar contraseña', // Subject line
				html: `<h3>Hola, ${user.username}.</h3>
					<b>Sigue este <a href="${link}">link</a> para resetear la contraseña de la cuenta ${user.email}.</b><br/><br/>
					<a href="${link}">${link}</a><br/><br/>
					<b>El link expirara en 15 minutos.</b>`, // html body
			};
			return await sendEmail(infoEmail);
		} catch (err) {
			throw boom.conflict();
		}
	}

	async passwordRecovery(token, newPassword) {
		try {
			const payload = jwt.verify(token, process.env.JWT_SEC_RECOVERY);
			const user = await this.userDAO.getUserById(payload.sub);
			if (user.recoveryToken != token) {
				throw boom.unauthorized();
			}

			// New password hash
			const newPasswordHash = bcrypt.hashSync(newPassword, 10);

			const userUpdated = await this.userDAO.updatePassword(user.id, newPasswordHash);

			// Check update
			if (user.password == userUpdated.password) {
				throw boom.conflict("Can't update password");
			}

			return { message: 'Password updated' };
		} catch (err) {
			throw boom.unauthorized();
		}
	}
	//#region

	async sendEmail(infoEmail) {
		return await sendRecoveryEmail(infoEmail);
	}

	signToken(user) {
		return jwt.sign(
			{
				sub: user.id,
				role: user.role,
				username: user.username,
			},
			process.env.JWT_SEC,
			{
				expiresIn: '7d',
			}
		);
	}

	decodeToken(token) {
		return jwt.decode(token, process.env.JWT_SEC);
	}
}

export { UserService };
