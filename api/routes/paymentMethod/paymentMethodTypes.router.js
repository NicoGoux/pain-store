import express from 'express';
import { getPaymentMethodTypes } from '../../controllers/paymentMethodControllers/paymentMethodsController.js';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';

const paymentMethodTypeRouter = express.Router();

paymentMethodTypeRouter.get(
	'/',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	getPaymentMethodTypes
);

export { paymentMethodTypeRouter };
