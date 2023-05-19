import { SkinConditionDAO } from '../../database/modelDAO/product/SkinConditionDAO.js';
import { SkinConditionService } from '../../services/product/skinCondition.service.js';

const skinConditionService = SkinConditionService.getInstance();

const getAll = async (req, res, next) => {
	try {
		const skinConditions = await skinConditionService.getSkinConditions();
		return res.json(skinConditions);
	} catch (err) {
		next(err);
	}
};

/**
 *
 * @description: Only for initial populate
 */
const populateSkinConditions = async (req, res, next) => {
	const skinConditions = [
		{ skinConditionString: 'Factory New', initials: 'FN', order: 1 },
		{ skinConditionString: 'Minimal Wear', initials: 'MW', order: 2 },
		{ skinConditionString: 'Field-Tested', initials: 'FT', order: 3 },
		{ skinConditionString: 'Well-Worn', initials: 'WW', order: 4 },
		{ skinConditionString: 'Battle-Scarred', initials: 'BS', order: 5 },
		{ skinConditionString: 'Vanilla', initials: 'V', order: 6 },
	];
	try {
		const skinConditionDAO = new SkinConditionDAO();
		await skinConditionDAO.insertSkinConditions(skinConditions);
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { getAll, populateSkinConditions };
