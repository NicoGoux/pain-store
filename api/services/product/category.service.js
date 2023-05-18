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
}

export { CategoryService };
