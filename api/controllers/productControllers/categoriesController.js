import { CategoryDAO } from '../../database/modelDAO/product/CategoryDAO.js';
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
	const categories = [
		{
			name: 'PISTOLAS',
			order: 1,
			parentCategory: null,
		},
		{
			name: 'RIFLES',
			order: 2,
			parentCategory: null,
		},
		{
			name: 'SUBFUSILES',
			order: 3,
			parentCategory: null,
		},
		{
			name: 'PESADAS',
			order: 4,
			parentCategory: null,
		},
		{
			name: 'CUCHILLOS',
			order: 5,
			parentCategory: null,
		},
		{
			name: 'GUANTES',
			order: 6,
			parentCategory: null,
		},
		{
			name: 'OTROS',
			order: 7,
			parentCategory: null,
		},
		{
			name: 'CAJAS Y LLAVES',
			order: 8,
			parentCategory: 'OTROS',
		},
		{
			name: 'AGENTES Y PARCHES',
			order: 9,
			parentCategory: 'OTROS',
		},
		{
			name: 'GRAFFITI',
			order: 10,
			parentCategory: 'OTROS',
		},
		{
			name: 'PINES',
			order: 11,
			parentCategory: 'OTROS',
		},
	];
	try {
		const categoryDAO = new CategoryDAO();
		await categoryDAO.insertCategories(categories);
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { getAllCategories, populateCategories };
