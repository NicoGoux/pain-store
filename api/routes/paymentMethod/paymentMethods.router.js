import express from 'express';
import { paymentMethodTypeRouter } from './paymentMethodTypes.router.js';
import {
	getAvailablePaymentMethodTypes,
	getAvailablePaymentMethods,
	getPaymentMethodTypes,
	getPaymentMethods,
	insertPaymentMethod,
	toggleActivePaymentMethod,
} from '../../controllers/paymentMethodControllers/paymentMethodsController.js';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { accessLevel } from '../../config/auth/accessLevel.js';
import { checkRoles } from '../../middlewares/auth.handler.js';

const paymentMethodRouter = express.Router();

// Purchase order statuses router
paymentMethodRouter.use('/payment-method-types', paymentMethodTypeRouter);

paymentMethodRouter.post(
	'/',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	insertPaymentMethod
);

paymentMethodRouter.get(
	'/toggle-active-method/:id',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	toggleActivePaymentMethod
);

paymentMethodRouter.get(
	'/available-payment-method-types',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	getAvailablePaymentMethodTypes
);

paymentMethodRouter.get(
	'/available-payment-methods/:paymentMethodType?',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	getAvailablePaymentMethods
);

paymentMethodRouter.get(
	'/:paymentMethodType?',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	getPaymentMethods
);

export { paymentMethodRouter };
