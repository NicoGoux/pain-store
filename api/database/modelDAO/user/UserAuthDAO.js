import boom from '@hapi/boom';
import { UserDTO } from '../../model/User/User.js';

class UserAuthDAO {
	constructor() {}

	//#region insert user
	async createUser(newUser) {
		try {
			const userDTO = new UserDTO(newUser);
			const newUserRegistered = await userDTO.save();
			delete newUserRegistered._doc.password;
			return newUserRegistered;
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on insert user',
				statusCode: 409,
			});
		}
	}
	//#endregion

	//#region get user
	async getUserByEmail(email) {
		const user = await UserDTO.findOne({ email: email });
		if (!user) {
			throw boom.notFound('User not found');
		}
		return user;
	}

	async getUserById(id) {
		const user = await UserDTO.findById(id).select('-password -recoveryToken');
		if (!user) {
			throw boom.notFound('User not found');
		}

		return user;
	}

	async getUserByUsername(username) {
		const user = await UserDTO.find({ username: { $regex: new RegExp(username, 'i') } }).select(
			'-password -recoveryToken'
		);
		if (!user) {
			throw boom.notFound('User not found');
		}

		return user;
	}
	//#endregion

	//#region change password
	async getUserPasswordHash(id) {
		const user = await UserDTO.findById(id).select('password');
		if (!user) {
			throw boom.notFound('User not found');
		}

		return user;
	}

	async changePassword(id, newPasswordHash) {
		try {
			return await UserDTO.findByIdAndUpdate(
				id,
				{ password: newPasswordHash },
				{ returnOriginal: false }
			);
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on update password',
				statusCode: 409,
			});
		}
	}
	//#endregion

	//#region confirm email
	async updateEmailConfirmToken(id, emailConfirmToken) {
		try {
			return await UserDTO.findByIdAndUpdate(
				id,
				{ emailConfirmToken: emailConfirmToken },
				{ returnOriginal: false }
			);
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on save emailConfirmToken',
				statusCode: 409,
			});
		}
	}

	async updateEmailConfirm(id) {
		try {
			return await UserDTO.findByIdAndUpdate(
				id,
				{ emailConfirm: true, emailConfirmToken: null },
				{ returnOriginal: false }
			);
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on confirm email',
				statusCode: 409,
			});
		}
	}

	async checkConfirmedEmail(id) {
		try {
			const user = await this.getUserById(id);
			return user.emailConfirm;
		} catch (err) {
			throw err;
		}
	}

	//#endregion

	//#region recovery password
	async updateRecoveryToken(id, recoveryToken) {
		try {
			return await UserDTO.findByIdAndUpdate(
				id,
				{ recoveryToken: recoveryToken },
				{ returnOriginal: false, new: true }
			);
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on save recoveryToken',
				statusCode: 409,
			});
		}
	}

	async getUserRecoveryToken(id) {
		const user = await UserDTO.findById(id).select('recoveryToken');
		if (!user) {
			throw boom.notFound('User not found');
		}

		return user;
	}

	async updatePassword(id, newPasswordHash) {
		try {
			return await UserDTO.findByIdAndUpdate(
				id,
				{ password: newPasswordHash, recoveryToken: null },
				{ returnOriginal: false }
			);
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on update password',
				statusCode: 409,
			});
		}
	}
	//#endregion
}

export { UserAuthDAO };
