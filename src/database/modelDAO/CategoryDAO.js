import boom from '@hapi/boom';
import { CategoryDTO } from '../model/product/Category.js';

class CategoryDAO {
	constructor() {}

	async getCategory(category) {
		return await CategoryDTO.findOne({ name: category.name }).populate();
	}

	async getCategories() {
		return await CategoryDTO.find();
	}

	async insertCategory(category) {
		try {
			if (category.parentCategory != null) {
				// Search parent
				const parent = await CategoryDTO.findOne({
					name: category.parentCategory,
				}).populate();

				if (!parent) {
					throw boom.conflict('Parent not found');
				}

				category.parentCategory = parent;
			}
			const categoryDTO = new CategoryDTO(category);
			return await categoryDTO.save();
		} catch (error) {
			throw error;
		}
	}

	// Only for populate
	async insertCategories(categories) {
		const categoriesInserted = await Promise.all(
			categories.map(await this.insertCategory)
		).catch((error) => {
			throw boom.boomify(error, {
				message: 'Conflict on insert category',
				statusCode: 409,
			});
		});

		return categoriesInserted;
	}
}

export { CategoryDAO };
