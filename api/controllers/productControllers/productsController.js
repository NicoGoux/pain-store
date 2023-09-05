import { ProductService } from '../../services/product/product.service.js';

const productService = ProductService.getInstance();

//#region get products
const getProducts = async (req, res, next) => {
	try {
		const filters = req.query;

		const products = await productService.getProducts(filters);

		return res.json(products);
	} catch (err) {
		next(err);
	}
};

const getAvailableProducts = async (req, res, next) => {
	try {
		const filters = req.query;

		const products = await productService.getAvailableProducts(filters);

		return res.json(products);
	} catch (err) {
		next(err);
	}
};

const getProduct = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await productService.getProduct(id);
		return res.json(product);
	} catch (err) {
		next(err);
	}
};

//#endregion

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

const checkAvailability = async (req, res, next) => {
	try {
		const { products } = req.body;
		const availableProducts = await productService.checkAvailability(products);
		return res.json(availableProducts);
	} catch (err) {
		next(err);
	}
};

export {
	getProducts,
	getProduct,
	getAvailableProducts,
	addProduct,
	updateProduct,
	checkAvailability,
};
