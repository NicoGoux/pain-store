import express from 'express';

//Categories controller
import { getAll } from '../../controllers/productControllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getAll);

export { categoriesRouter };
