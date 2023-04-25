import express from 'express';
import { CategoryService } from '../services/category.service.js';

const categoryService = CategoryService.getInstance();

const categoryRouter = express.Router();

categoryRouter.get('/all', async (req, res) => {
	try {
		const categories = await categoryService.getCategories();
		res.json(categories);
	} catch (error) {
		res.json(error);
	}
});

export { categoryRouter };
