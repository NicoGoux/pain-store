import { CategoryDAO } from '../database/modelDAO/CategoryDAO.js';
import { CategoryService } from '../services/category.service.js';

const categoryService = CategoryService.getInstance();

const getAll = async (req, res, next) => {
	try {
		const categories = await categoryService.getCategories();
		return res.json(categories);
	} catch (err) {
		next(err);
	}
};

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

export { getAll, populateCategories };
