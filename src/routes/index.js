import express from 'express';

import { productsRouter } from './product/products.router.js';

const router = express.Router();

function routerApi(app) {
	app.use('/api/v1', router);
	router.use('/products', productsRouter);
}

export { routerApi };

router.get('/', (req, res) => {
	res.send('[Server] connected');
});
