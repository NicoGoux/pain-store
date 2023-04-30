import { SkinConditionDTO } from '../model/product/SkinCondition.js';

class SkinConditionDAO {
	constructor() {}

	async getSkinCondition(skinCondition) {
		return await SkinConditionDTO.findOne({
			skinConditionString: skinCondition.skinConditionString,
		});
	}

	async getSkinConditions() {
		return await SkinConditionDTO.find();
	}

	async insertSkinCondition(skinCondition) {
		try {
			const skinConditionDTO = new SkinConditionDTO(skinCondition);
			const skinConditionSaved = skinConditionDTO.save();
			if (skinConditionSaved) {
				return skinCondition;
			}
		} catch (error) {
			throw error;
		}
	}

	async insertSkinConditions(skinConditions) {
		const skinConditionsInserted = await Promise.all(
			skinConditions.map(await this.insertSkinCondition)
		).catch((error) => {
			throw boom.boomify(error, {
				message: 'Conflict on insert skin conditions',
				statusCode: 409,
			});
		});

		return skinConditionsInserted;
	}
}

export { SkinConditionDAO };
