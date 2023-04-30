import { SkinConditionDAO } from '../database/modelDAO/SkinConditionDAO.js';

let instance;

class SkinConditionService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new SkinConditionService();
		}
	}

	constructor() {
		this.skinConditionDAO = new SkinConditionDAO();
	}

	getSkinConditions() {
		return this.skinConditionDAO.getSkinConditions();
	}
}

export { SkinConditionService };
