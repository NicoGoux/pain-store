import express from 'express';
import { getPurchaseOrderStatuses } from '../../controllers/purchaseOrderControllers/purchaseOrderStatusController.js';

const purchaseOrderStatusesRouter = express.Router();

purchaseOrderStatusesRouter.get('/', getPurchaseOrderStatuses);

export { purchaseOrderStatusesRouter };
