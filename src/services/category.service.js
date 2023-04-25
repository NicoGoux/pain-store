import { CategoryDAO } from '../supabase/modelDAO/CategoryDAO.js';

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
}

export { CategoryService };
