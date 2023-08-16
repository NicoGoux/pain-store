import express from 'express';
import { populateCategories } from '../controllers/productControllers/categoriesController.js';
import { populateSkinConditions } from '../controllers/productControllers/skinConditionsController.js';
import { passportAuthJwt } from '../config/auth/passportAuth.js';
import { checkRoles } from '../middlewares/auth.handler.js';
import { accessLevel } from '../config/auth/accessLevel.js';
import { populateProductStatuses } from '../controllers/productControllers/productStatusesController.js';
import { populatePurchaseOrderStatuses } from '../controllers/purchaseOrderControllers/purchaseOrderStatusController.js';
import { populatePaymentMethodTypes } from '../controllers/paymentMethodControllers/paymentMethodsController.js';

const populateRouter = express.Router();

//TODO Only for populate
populateRouter.post(
	'/',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	populatePaymentMethodTypes,
	populatePurchaseOrderStatuses,
	populateCategories,
	populateSkinConditions,
	populateProductStatuses,
	(req, res, next) => {
		res.send('Populate complete');
	}
);

export { populateRouter };
