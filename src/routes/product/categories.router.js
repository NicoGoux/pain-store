import express from 'express';

//Categories controller
import { getAll } from '../../controllers/categoriesController.js';

const categoryRouter = express.Router();

categoryRouter.get('/', getAll);

export { categoryRouter };
