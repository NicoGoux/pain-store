// Status controller

import { ProductStatusDAO } from '../../database/modelDAO/product/ProductStatusDAO.js';
import { ProductService } from '../../services/product/product.service.js';

const productService = ProductService.getInstance();

const getProductStatuses = async (req, res, next) => {
	try {
		const productStatuses = await productService.getProductStatuses();
		return res.json(productStatuses);
	} catch (err) {
		next(err);
	}
};
/**
 *
 * @description: Only for initial populate
 */
const populateProductStatuses = async (req, res, next) => {
	try {
		await productService.populateProductStatuses();
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { populateProductStatuses, getProductStatuses };
