import express from 'express';

import { productsRouter } from './product/products.router.js';
import { usersRouter } from './user/user.router.js';
import { purchaseOrderRouter } from './purchaseOrder/purchaseOrders.router.js';

// Populate middlewares / only for init database
import { populateRouter } from './populate.router.js';
import { paymentMethodRouter } from './paymentMethod/paymentMethods.router.js';

const router = express.Router();

function routerApi(app) {
	app.use('/api/v1', router);
	router.use('/products', productsRouter);
	router.use('/users', usersRouter);
	router.use('/purchase-orders', purchaseOrderRouter);
	router.use('/payment-methods', paymentMethodRouter);

	/**
	 * @description: Only for initial populate
	 */
	router.use('/populate', populateRouter);
}

export { routerApi };

router.get('/', (req, res) => {
	res.send('[Server] connected');
});
