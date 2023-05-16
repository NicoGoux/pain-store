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
		{ skinConditionString: 'Factory New' },
		{ skinConditionString: 'Minimal Wear' },
		{ skinConditionString: 'Field-Tested' },
		{ skinConditionString: 'Well-Worn' },
		{ skinConditionString: 'Battle-Scarred' },
		{ skinConditionString: 'Vanilla' },
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
