import { UserService } from '../../services/user/user.service.js';

const userService = UserService.getInstance();

//#region Register user
const registerUser = async (req, res, next) => {
	try {
		const newUser = req.body.user;
		const newUserRegistered = await userService.registerUser(newUser);
		return res.json(newUserRegistered);
	} catch (err) {
		next(err);
	}
};

const registerAdmin = async (req, res, next) => {
	try {
		const newAdmin = req.body.user;
		const newAdminRegistered = await userService.registerAdmin(newAdmin);
		return res.json(newAdminRegistered);
	} catch (err) {
		next(err);
	}
};
//#endregion

//#region Login user
const loginUser = async (req, res, next) => {
	try {
		const user = req.user;
		const token = userService.signToken(user);
		const payload = userService.decodeToken(token);
		res.json({ ...payload, token });
	} catch (err) {
		next(err);
	}
};

const autoLoginUser = async (req, res, next) => {
	try {
		res.json(req.user);
	} catch (err) {
		next(err);
	}
};
//#endregion

//#region Confirm email
const sendEmailConfirm = async (req, res, next) => {
	try {
		const user = req.user;
		const message = await userService.sendConfirmEmail(user);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};

const emailConfirm = async (req, res, next) => {
	try {
		const { emailConfirmToken } = req.body;
		const message = await userService.confirmEmail(emailConfirmToken);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};
//#endregion

//#region Password recovery
const emailPasswordRecovery = async (req, res, next) => {
	try {
		const { email } = req.body;
		const message = await userService.sendPasswordRecovery(email);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};

const passwordRecovery = async (req, res, next) => {
	try {
		const { recoveryPasswordToken, password } = req.body;
		const message = await userService.passwordRecovery(recoveryPasswordToken, password);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};

//#endregion

export {
	registerUser,
	registerAdmin,
	loginUser,
	autoLoginUser,
	sendEmailConfirm,
	emailConfirm,
	emailPasswordRecovery,
	passwordRecovery,
};
