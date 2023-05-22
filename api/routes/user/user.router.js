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
	recoveryEmailSchema,
	recoveryPasswordSchema,
	registerUserSchema,
	confirmEmailSchema,
	sendConfirmEmailSchema,
} from '../../schemas/user.joi.schemas.js';
import { passportAuthJwt, passportAuthLocal } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';
import {
	getUserCart,
	insertProductToCart,
	removeProductToCart,
} from '../../controllers/userController/userCartController.js';

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
usersRouter.post(
	'/send-confirm-email',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	validatorHandler(sendConfirmEmailSchema, 'body'),
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
usersRouter.post('/recovery', validatorHandler(recoveryEmailSchema, 'body'), emailPasswordRecovery);

usersRouter.post(
	'/recovery/change-password',
	validatorHandler(recoveryPasswordSchema, 'body'),
	passwordRecovery
);

// User cart
usersRouter.get('/cart', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), getUserCart);

usersRouter.post('/cart', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), insertProductToCart);

usersRouter.post(
	'/cart/remove',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	removeProductToCart
);

export { usersRouter };
