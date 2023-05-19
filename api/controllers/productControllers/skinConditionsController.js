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
		{ skinConditionString: 'Factory New', initials: 'FN' },
		{ skinConditionString: 'Minimal Wear', initials: 'MW' },
		{ skinConditionString: 'Field-Tested', initials: 'FT' },
		{ skinConditionString: 'Well-Worn', initials: 'WW' },
		{ skinConditionString: 'Battle-Scarred', initials: 'BS' },
		{ skinConditionString: 'Vanilla', initials: 'V' },
	];

	try {
		const skinConditionDAO = new SkinConditionDAO();
		const log = await skinConditionDAO.updateSkinCondition({
			skinConditionString: 'Factory New',
			initials: 'FN',
		});
		console.log(log);
		res.json(log);
		return;
	} catch (err) {
		next(err);
	}
};

export { getAll, populateSkinConditions };
