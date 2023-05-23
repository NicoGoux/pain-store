import { ProductStatusDAO } from '../../database/modelDAO/product/ProductStatusDAO.js';
import { ProductService } from '../../services/product/product.service.js';

const productService = ProductService.getInstance();

const getProducts = async (req, res, next) => {
	try {
		const filters = req.query;

		const products = await productService.getProducts(filters);

		return res.json(products);
	} catch (err) {
		next(err);
	}
};

const getProduct = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await productService.getProduct(id);

		console.log(productWithImage);
		return res.json(productWithImage);
	} catch (err) {
		next(err);
	}
};

const addProduct = async (req, res, next) => {
	try {
		const { product } = req.body;
		const productAdded = await productService.addProduct(product);
		res.json(productAdded);
		return;
	} catch (err) {
		next(err);
	}
};

const updateProduct = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { patch } = req.body;
		const productUpdated = await productService.updateProduct(id, patch);
		return res.json(productUpdated);
	} catch (err) {
		next(err);
	}
};

// // TODO
// const reserveProduct;
// const ocultProduct;
// const sellProduct;

// Status controller
/**
 *
 * @description: Only for initial populate
 */
const populateProductStatuses = async (req, res, next) => {
	const productStatuses = [
		{
			productStatusString: 'DISPONIBLE',
		},
		{
			productStatusString: 'RESERVADO',
		},
		{
			productStatusString: 'VENDIDO',
		},
		{
			productStatusString: 'OCULTO',
		},
	];
	try {
		const productStatusDAO = new ProductStatusDAO();
		await productStatusDAO.insertProductStatuses(productStatuses);
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { getProducts, getProduct, addProduct, updateProduct, populateProductStatuses };
