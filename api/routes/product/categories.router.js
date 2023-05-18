import express from 'express';

//Categories controller
import { getAllCategories } from '../../controllers/productControllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getAllCategories);

export { categoriesRouter };
