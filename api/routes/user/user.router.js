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
	getUserLogged,
	changePassword,
	checkConfirmedEmail,
} from '../../controllers/userControllers/userController.js';
import {
	loginUserSchema,
	recoveryEmailSchema,
	recoveryPasswordSchema,
	registerUserSchema,
	validateEmailSchema,
	sendValidateEmailSchema,
} from '../../schemas/user.joi.schemas.js';
import { passportAuthJwt, passportAuthLocal } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';
import {
	getUserCart,
	insertProductToCart,
	removeProductToCart,
} from '../../controllers/userControllers/userCartController.js';

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

usersRouter.get('/autologin', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), autoLoginUser);

// get user
usersRouter.get('/user-logged', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), getUserLogged);

// Change password
//TODO validator
usersRouter.patch(
	'/change-password',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	changePassword
);

// Confirm email
usersRouter.post(
	'/send-validate-email',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	validatorHandler(sendValidateEmailSchema, 'body'),
	sendEmailConfirm
);

usersRouter.post('/validate-email', validatorHandler(validateEmailSchema, 'body'), emailConfirm);

usersRouter.get(
	'/check-confirmed-email',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	checkConfirmedEmail
);

// Recovery password
usersRouter.post('/recovery', validatorHandler(recoveryEmailSchema, 'body'), emailPasswordRecovery);

usersRouter.post(
	'/recovery/change-password',
	validatorHandler(recoveryPasswordSchema, 'body'),
	passwordRecovery
);

// User cart
//TODO validator
usersRouter.get('/cart', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), getUserCart);

usersRouter.post('/cart', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), insertProductToCart);

usersRouter.post(
	'/cart/remove',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	removeProductToCart
);

export { usersRouter };
