import express from 'express';

import { productsRouter } from './products.router.js';
import { categoryRouter } from './categories.router.js';

function routerApi(app) {
	const router = express.Router();
	app.use('/api/v1', router);
	router.use('/products', productsRouter);
	router.use('/categories', categoryRouter);
}

export { routerApi };
