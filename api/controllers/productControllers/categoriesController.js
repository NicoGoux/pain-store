import { CategoryService } from '../../services/product/category.service.js';

const categoryService = CategoryService.getInstance();

const getAllCategories = async (req, res, next) => {
	try {
		const categories = await categoryService.getCategories();
		return res.json(categories);
	} catch (err) {
		next(err);
	}
};

/**
 *
 * @description: Only for initial populate
 */
const populateCategories = async (req, res, next) => {
	try {
		await categoryService.populateCategories();
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { getAllCategories, populateCategories };
