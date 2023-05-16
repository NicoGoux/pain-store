import express from 'express';

import { productsRouter } from './product/products.router.js';
import { usersRouter } from './user/user.router.js';

const router = express.Router();

function routerApi(app) {
	app.use('/api/v1', router);
	router.use('/products', productsRouter);
	router.use('/users', usersRouter);
}

export { routerApi };

router.get('/', (req, res) => {
	res.send('[Server] connected');
});
