import bcrypt from 'bcrypt';
import { UserAuthDAO } from '../../database/modelDAO/user/UserAuthDAO.js';
import boom from '@hapi/boom';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/nodemailer.js';
import { UserCartDAO } from '../../database/modelDAO/user/UserCartDAO.js';

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
		this.userAuthDAO = new UserAuthDAO();
		this.userCartDAO = new UserCartDAO();
	}

	//#region  Register user
	registerUser(newUser) {
		const hash = bcrypt.hashSync(newUser.password, 10);
		return this.userAuthDAO.createUser({ ...newUser, password: hash });
	}

	registerAdmin(newUser) {
		const hash = bcrypt.hashSync(newUser.password, 10);
		return this.userAuthDAO.createUser({ ...newUser, role: 'ADMIN', password: hash });
	}
	//#endregion

	//#region Login user
	async loginUserByEmail(email, password) {
		const user = await this.userAuthDAO.getUserByEmail(email);

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw boom.unauthorized('Incorrect password');
		}

		delete user._doc.password;
		return user;
	}

	async getUserById(userId) {
		const user = await this.userAuthDAO.getUserById(userId);
		delete user._doc.password;
		return user;
	}
	//#endregion

	//#region confirm email
	async sendValidateEmail(user, domain) {
		try {
			const userFound = await this.userAuthDAO.getUserById(user.sub);

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
			const userUpdated = await this.userAuthDAO.updateEmailConfirmToken(
				userFound.id,
				emailConfirmToken
			);

			// Check update
			if (userFound.emailConfirmToken == userUpdated.emailConfirmToken) {
				throw boom.conflict("Can't update confirmToken");
			}

			//TODO
			const link = `http://${domain}/#/account/validate-email?emailToken=${emailConfirmToken}`;

			// email message
			const infoEmail = {
				from: process.env.EMAIL_USER, // sender address
				to: userFound.email, // list of receivers
				subject: 'Pain Store - Confirmar email', // Subject line
				html: `<h3>Hola, ${userFound.username}.</h3>
					<b>Sigue este <a href="${link}">link</a> para validar el email de la cuenta: ${userFound.email}.</b><br/><br/>
					<a href="${link}">${link}</a><br/><br/>
					<b>El link expirara en 15 minutos.</b>`, // html body
			};
			return await sendEmail(infoEmail);
		} catch (err) {
			throw boom.boomify(err, {
				message: 'unauthorized',
				statusCode: 409,
			});
		}
	}

	async validateEmail(token) {
		try {
			const payload = jwt.verify(token, process.env.JWT_SEC_CONFIRM_EMAIL);

			const user = await this.userAuthDAO.getUserById(payload.sub);

			if (user.emailConfirm) {
				return { message: 'Email confirmed' };
			}

			if (user.emailConfirmToken != token) {
				throw boom.unauthorized();
			}

			const userUpdated = await this.userAuthDAO.updateEmailConfirm(user.id);

			// Check update
			if (user.emailConfirm == userUpdated.emailConfirm) {
				throw boom.conflict("Can't confirm email");
			}

			return { message: 'Email confirmed' };
		} catch (err) {
			throw boom.unauthorized();
		}
	}

	async checkConfirmedEmail(user) {
		const isEmailConfirmed = await this.userAuthDAO.checkConfirmedEmail(user.sub);
		return { isEmailConfirmed: isEmailConfirmed };
	}
	//#endregion

	//#region change password
	async changePassword(user, password, newPassword) {
		const userFound = await this.userAuthDAO.getUserPasswordHash(user.sub);
		const passwordMatch = await bcrypt.compare(password, userFound.password);
		if (!passwordMatch) {
			throw boom.unauthorized('Incorrect password');
		}

		userFound.password = newPassword;
		const newPasswordHash = bcrypt.hashSync(userFound.password, 10);

		await this.userAuthDAO.changePassword(userFound._id, newPasswordHash);

		return { message: 'password changed' };
	}
	//#endregion

	//#region password recovery
	async sendPasswordRecovery(email, domain) {
		try {
			const user = await this.userAuthDAO.getUserByEmail(email);

			// Create recovery password token for the user
			const recoveryToken = jwt.sign(
				{
					sub: user.id,
				},
				process.env.JWT_SEC_RECOVERY,
				{ expiresIn: '15min' }
			);

			// Add token to the user
			const userUpdated = await this.userAuthDAO.updateRecoveryToken(user.id, recoveryToken);

			// Check update
			if (user.recoveryToken == userUpdated.recoveryToken) {
				console.log(user.recoveryToken);
				console.log(userUpdated.recoveryToken);
				throw boom.conflict("Can't update recoveryToken");
			}

			//TODO
			const link = `http://${domain}/#/login/recovery/password?token=${recoveryToken}`;

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
			throw err;
		}
	}

	async passwordRecovery(token, newPassword) {
		try {
			const payload = jwt.verify(token, process.env.JWT_SEC_RECOVERY);
			const user = await this.userAuthDAO.getUserRecoveryToken(payload.sub);
			if (user.recoveryToken != token) {
				throw boom.unauthorized();
			}

			// New password hash
			const newPasswordHash = bcrypt.hashSync(newPassword, 10);

			const userUpdated = await this.userAuthDAO.updatePassword(user.id, newPasswordHash);

			// Check update
			if (user.password == userUpdated.password) {
				throw boom.conflict("Can't update password");
			}

			return { message: 'Password updated' };
		} catch (err) {
			throw boom.unauthorized();
		}
	}
	//#endregion

	//#region user cart
	getUserCart(user) {
		return this.userCartDAO.getUserCart(user.sub);
	}

	insertProductToCart(user, productId) {
		return this.userCartDAO.insertProductToCart(user.sub, productId);
	}

	removeProductToCart(user, productId) {
		return this.userCartDAO.removeProductToCart(user.sub, productId);
	}
	//#endregion

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
