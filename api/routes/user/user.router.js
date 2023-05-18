import express from 'express';
import { validatorHandler } from '../../middlewares/validator.handler.js';
import {
	autoLoginUser,
	loginUser,
	emailPasswordRecovery,
	registerAdmin,
	registerUser,
	passwordRecovery,
	emailConfirm,
	sendEmailConfirm,
} from '../../controllers/userController/userController.js';
import {
	loginUserSchema,
	emailSchema,
	recoveryPasswordSchema,
	registerUserSchema,
	confirmEmailSchema,
} from '../../schemas/user.joi.schemas.js';
import { passportAuthJwt, passportAuthLocal } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';

const usersRouter = express.Router();

// Register user
usersRouter.post('/register', validatorHandler(registerUserSchema, 'body'), registerUser);

usersRouter.post(
	'/register/adm',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	validatorHandler(registerUserSchema, 'body'),
	registerAdmin
);

// Login user
usersRouter.post('/login', validatorHandler(loginUserSchema, 'body'), passportAuthLocal, loginUser);

usersRouter.get('/autologin', passportAuthJwt, autoLoginUser);

// Confirm email
usersRouter.get(
	'/confirm-email',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	sendEmailConfirm
);

usersRouter.post(
	'/confirm-email',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	validatorHandler(confirmEmailSchema, 'body'),
	emailConfirm
);

// Recovery password
usersRouter.post('/recovery', validatorHandler(emailSchema, 'body'), emailPasswordRecovery);

usersRouter.post(
	'/recovery/change-password',
	validatorHandler(recoveryPasswordSchema, 'body'),
	passwordRecovery
);

export { usersRouter };
