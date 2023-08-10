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

const getUserLogged = async (req, res, next) => {
	try {
		const user = req.user;
		const userFound = await userService.getUserById(user.sub);
		res.json(userFound);
	} catch (err) {
		next(err);
	}
};
//#endregion

//#region Confirm email
const sendEmailConfirm = async (req, res, next) => {
	try {
		const user = req.user;
		const { domain } = req.body;
		const message = await userService.sendValidateEmail(user, domain);
		return res.json(message);
	} catch (err) {
		next(err);
	}
};

const emailConfirm = async (req, res, next) => {
	try {
		const { emailConfirmToken } = req.body;
		const message = await userService.validateEmail(emailConfirmToken);
		return res.json(message);
	} catch (err) {
		next(err);
	}
};
//#endregion

const changePassword = async (req, res, next) => {
	try {
		const user = req.user;
		const { password, newPassword } = req.body;
		const message = await userService.changePassword(user, password, newPassword);
		res.json(message);
	} catch (err) {
		next(err);
	}
};

//#region Password recovery
const emailPasswordRecovery = async (req, res, next) => {
	try {
		const { email, domain } = req.body;
		const message = await userService.sendPasswordRecovery(email, domain);
		return res.json(message);
	} catch (err) {
		next(err);
	}
};

const passwordRecovery = async (req, res, next) => {
	try {
		const { recoveryPasswordToken, password } = req.body;
		const message = await userService.passwordRecovery(recoveryPasswordToken, password);
		return res.json(message);
	} catch (err) {
		next(err);
	}
};

//#endregion

export {
	registerUser,
	registerAdmin,
	loginUser,
	getUserLogged,
	changePassword,
	autoLoginUser,
	sendEmailConfirm,
	emailConfirm,
	emailPasswordRecovery,
	passwordRecovery,
};
