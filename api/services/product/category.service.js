import { CategoryDAO } from '../../database/modelDAO/product/CategoryDAO.js';

let instance;

class CategoryService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new CategoryService();
		}
	}

	constructor() {
		this.categoryDAO = new CategoryDAO();
	}

	getCategory(category) {
		return this.categoryDAO.getCategory(category);
	}

	insertCategory(category) {
		return this.categoryDAO.insertCategory(category);
	}

	async getCategories() {
		const categoriesWithoutParent = await this.categoryDAO.getCategoriesWithoutParent();
		const categories = await Promise.all(
			categoriesWithoutParent.map(async (category) => {
				const childrenCategories = await this.getCategoriesWithParent(category);
				return {
					id: category._id,
					name: category.name,
					order: category.order,
					childrenCategories: childrenCategories,
				};
			})
		);
		return categories;
	}

	async getCategoriesWithParent(category) {
		const childrenCategories = await this.categoryDAO.getCategoriesWithParent(category);
		const childrenCategoriesWithChildren = await Promise.all(
			childrenCategories.map(async (category) => {
				const childrenCategories = await this.getCategoriesWithParent(category);

				return {
					id: category._id,
					name: category.name,
					order: category.order,
					childrenCategories: childrenCategories,
				};
			})
		);
		return childrenCategoriesWithChildren;
	}

	/**
	 *
	 * @description: Only for initial populate
	 */
	async populateCategories() {
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
		return await this.categoryDAO.insertCategories(categories);
	}
}

export { CategoryService };
