import express from 'express';

// Subroutes
import { categoriesRouter } from './categories.router.js';
import { skinConditionsRouter } from './skinConditions.router.js';
import { marketHashesRouter } from './marketHashes.router.js';

// Controllers
import {
	addProduct,
	getProduct,
	getProducts,
	updateProduct,
} from '../../controllers/productControllers/productsController.js';

// Validator middleware
import { validatorHandler } from '../../middlewares/validator.handler.js';
import { createProductSchema, updateProductSchema } from '../../schemas/product.joi.schema.js';

// Populate middlewares / only for init database
import { populateRouter } from './populate.router.js';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';

const productsRouter = express.Router();

// Categories router
productsRouter.use('/categories', categoriesRouter);

// Skin conditions router
productsRouter.use('/skin-conditions', skinConditionsRouter);

// Market hashes router
productsRouter.use('/market_hashes', marketHashesRouter);

/**
 * @description: Only for initial populate
 */
productsRouter.use('/populate', passportAuthJwt, checkRoles(accessLevel.LEVEL_1), populateRouter);

// Get products
productsRouter.get('/', getProducts);

// Get product by id
productsRouter.get('/:id', getProduct);

//Add product
productsRouter.post(
	'/',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	validatorHandler(createProductSchema, 'body'),
	addProduct
);

//Update product
productsRouter.patch(
	'/:id',
	passportAuthJwt,
	checkRoles(accessLevel.LEVEL_1),
	validatorHandler(updateProductSchema, 'body'),
	updateProduct
);

export { productsRouter };
