import boom from '@hapi/boom';
import { CategoryDTO } from '../../model/product/Category.js';

class CategoryDAO {
	constructor() {}

	async getCategory(category) {
		return await CategoryDTO.findOne({ name: category.name });
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
				});

				if (!parent) {
					throw boom.conflict('Parent not found');
				}

				category.parentCategory = parent;
			}
			const categoryDTO = new CategoryDTO(category);
			return await categoryDTO.save();
		} catch (err) {
			throw err;
		}
	}

	// Only for populate
	async insertCategories(categories) {
		const categoriesInserted = await Promise.all(
			categories.map(await this.insertCategory)
		).catch((err) => {
			throw boom.boomify(err, {
				message: 'Conflict on insert category',
				statusCode: 409,
			});
		});

		return categoriesInserted;
	}
}

export { CategoryDAO };
