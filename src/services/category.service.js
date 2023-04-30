import { CategoryDAO } from '../database/modelDAO/CategoryDAO.js';

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

	getCategories() {
		return this.categoryDAO.getCategories();
	}

	getCategory(category) {
		return this.categoryDAO.getCategory(category);
	}

	insertCategory(category) {
		return this.categoryDAO.insertCategory(category);
	}
}

export { CategoryService };
