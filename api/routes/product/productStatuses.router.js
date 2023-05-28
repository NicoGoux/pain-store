import express from 'express';
import { getProductStatuses } from '../../controllers/productControllers/productsController.js';

const productStatusesRouter = express.Router();

productStatusesRouter.get('/', getProductStatuses);

export { productStatusesRouter };
