import express from 'express';
import { populateCategories } from '../../controllers/productControllers/categoriesController.js';
import { populateSkinConditions } from '../../controllers/productControllers/skinConditionsController.js';
import { populateProductStatuses } from '../../controllers/productControllers/productsController.js';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';

const populateRouter = express.Router();

//TODO Only for populate
populateRouter.post(
	'/',
	populateCategories,
	populateSkinConditions,
	populateProductStatuses,
	(req, res, next) => {
		res.send('Populate complete');
	}
);

export { populateRouter };
