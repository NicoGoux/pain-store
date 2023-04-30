import express from 'express';

import { categoryRouter } from './categories.router.js';
import { skinConditionRouter } from './skinCondition.router.js';

import {
	addProduct,
	updateProduct,
	getProducts,
	getProduct,
	populateProductStatuses,
} from '../../controllers/productsController.js';

// Validator middleware
import { validatorHandler } from '../../middlewares/validator.handler.js';
import {
	createProductSchema,
	updateProductSchema,
} from '../../validator/schemas/product.joi.schema.js';

// Populate middlewares
import { populateCategories } from '../../controllers/categoriesController.js';
import { populateSkinConditions } from '../../controllers/skinConditionsController.js';
import { getMarketHashes, insertMarketHash } from '../../controllers/marketHashController.js';

const productsRouter = express.Router();

// Categories router
productsRouter.use('/categories', categoryRouter);
productsRouter.use('/skin_conditions', skinConditionRouter);

// Get products
productsRouter.get('/', getProducts);

// Get products
productsRouter.get('/:id', getProduct);

//Add product
productsRouter.post('/', validatorHandler(createProductSchema, 'body'), addProduct);

//Update product
productsRouter.patch('/:id', validatorHandler(updateProductSchema, 'body'), updateProduct);

//Get market hashes
productsRouter.get('/market_hashes', getMarketHashes);

//TODO Only for populate
productsRouter.post(
	'/populate',
	populateCategories,
	populateSkinConditions,
	populateProductStatuses,
	(req, res, next) => {
		res.send('Populate complete');
	}
);

//TODO Only for test
productsRouter.post('/market_hash', insertMarketHash);

export { productsRouter };
