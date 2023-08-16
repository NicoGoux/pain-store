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
	try {
		await skinConditionService.populateSkinConditions();
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { getAll, populateSkinConditions };
