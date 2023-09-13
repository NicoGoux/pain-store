import express from 'express';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';
import {
	createPurchaseOrder,
	getPurchaseOrder,
	getPurchaseOrderByProduct,
	getPurchaseOrders,
	getUserPurchaseOrder,
	getUserPurchaseOrders,
	rejectPurchaseOrder,
	updatePurchaseOrderStatus,
} from '../../controllers/purchaseOrderControllers/purchaseOrderController.js';
import { purchaseOrderStatusesRouter } from './purchaseOrderStatuses.router.js';
import { createPurchaseOrderSchema } from '../../schemas/purchaseOrder.joi.schema.js';
import { validatorHandler } from '../../middlewares/validator.handler.js';

const purchaseOrderRouter = express.Router();

// Purchase order statuses router
purchaseOrderRouter.use('/purchase-order-statuses', purchaseOrderStatusesRouter);

// Get purchase orders
purchaseOrderRouter.get('/', passportAuthJwt, checkRoles(accessLevel.LEVEL_1), getPurchaseOrders);

purchaseOrderRouter.get(
	'/user-purchase-orders',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	getUserPurchaseOrders
);

purchaseOrderRouter.get(
	'/user-purchase-orders/:id',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	getUserPurchaseOrder
);

purchaseOrderRouter.get(
	'/product-purchase-order/:productId',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	getPurchaseOrderByProduct
);

purchaseOrderRouter.get('/:id', passportAuthJwt, checkRoles(accessLevel.LEVEL_1), getPurchaseOrder);

// Create new purchase order
purchaseOrderRouter.post(
	'/',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	validatorHandler(createPurchaseOrderSchema, 'body'),
	createPurchaseOrder
);

// Change pending status
purchaseOrderRouter.patch(
	'/update-order-status',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	updatePurchaseOrderStatus
);

purchaseOrderRouter.patch(
	'/reject-purchase-order',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_2),
	rejectPurchaseOrder
);

export { purchaseOrderRouter };
