import express from 'express';
import { validatorHandler } from '../../middlewares/validator.handler.js';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';
import { createPurchaseOrder } from '../../controllers/purchaseOrderControllers/purchaseOrderController.js';
import { purchaseOrderStatusesRouter } from './purchaseOrderStatuses.router.js';

const purchaseOrderRouter = express.Router();

// Purchase order statuses router
purchaseOrderRouter.use('/purchase-order-statuses', purchaseOrderStatusesRouter);

purchaseOrderRouter.get('/', passportAuthJwt, checkRoles(accessLevel.LEVEL_2), createPurchaseOrder);

export { purchaseOrderRouter };
