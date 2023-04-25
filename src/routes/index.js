import express from 'express';

import { productsRouter } from './products.router.js';

function routerApi(app) {
	const router = express.Router();
	app.use('/api/v1', router);
	router.use('/products', productsRouter);
}

export { routerApi };
