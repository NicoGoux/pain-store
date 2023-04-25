import express from 'express';
import { ProductService } from '../services/product.service.js';
import { CategoryService } from '../services/category.service.js';
import { MarketHashService } from '../services/marketHash.service.js';
import { Category } from '../model/Product/Category.js';
import { MarketHash } from '../model/Product/MarketHash.js';

const productsRouter = express.Router();
const productService = ProductService.getInstance();
const categoryService = CategoryService.getInstance();
const marketHashService = MarketHashService.getInstance();

// Get all products
productsRouter.get('/all', (req, res) => {
	try {
		const { limit, offset } = req.query;
		const products = productService.getAllProducts();
		res.json(products);
	} catch (error) {
		res.send('error');
	}
});

//Get products with category
productsRouter.get('/:category', (req, res) => {
	return;
});

// Get products with filter
productsRouter.get('/', (req, res) => {
	return;
});

// Get a product
productsRouter.get('/:id', (req, res) => {
	const { id } = req.params;
	return;
});

//Add product
productsRouter.post('/', async (req, res) => {
	try {
		// const category = await categoryService.getCategory(new Category(null, 'RIFLES'));

		const mhSearch = new MarketHash(null, 'AK-47 | Redline', new Category(null, 'RIFLES'));

		let mh = await marketHashService.getMarketHash(mhSearch);

		if (!mh) {
			mh = await marketHashService.insertMarketHash(mhSearch);
		}

		console.log(mh);
		res.json(mh);
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

//Update product
productsRouter.patch('/:id', (req, res) => {
	return;
});

export { productsRouter };
