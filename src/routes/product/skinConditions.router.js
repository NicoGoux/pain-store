import express from 'express';
import { getAll } from '../../controllers/productControllers/skinConditionsController.js';

const skinConditionsRouter = express.Router();

skinConditionsRouter.get('/', getAll);

export { skinConditionsRouter };
