import { SkinConditionDAO } from '../../database/modelDAO/product/SkinConditionDAO.js';

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

	async populateSkinConditions() {
		const skinConditions = [
			{ skinConditionString: 'Factory New', initials: 'FN', order: 1 },
			{ skinConditionString: 'Minimal Wear', initials: 'MW', order: 2 },
			{ skinConditionString: 'Field-Tested', initials: 'FT', order: 3 },
			{ skinConditionString: 'Well-Worn', initials: 'WW', order: 4 },
			{ skinConditionString: 'Battle-Scarred', initials: 'BS', order: 5 },
			{ skinConditionString: 'Vanilla', initials: 'V', order: 6 },
		];
		await this.skinConditionDAO.insertSkinConditions(skinConditions);
		return;
	}
}

export { SkinConditionService };
