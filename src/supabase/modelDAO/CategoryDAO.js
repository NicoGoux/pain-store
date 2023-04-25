import { supabase } from '../SupabaseClient.js';
import { CategoryDTO } from '../modelDTO/CategoryDTO.js';

class CategoryDAO {
	constructor() {}

	//TODO Boom error

	async getCategories() {
		const { data, error } = await supabase.from('category').select();

		if (error || data.length == 0) {
			throw error;
		}

		return data;
	}

	async getCategory(category) {
		const { data, error } = await supabase
			.from('category')
			.select()
			.eq('category', category.category);

		if (error) throw error;

		if (data && data.length != 0) {
			return data[0];
		} else {
			return false;
		}
	}

	async insertCategory(category) {
		const categoryInBd = await this.getCategory(category);

		if (categoryInBd) {
			return categoryInBd;
		}

		const categoryDTO = new CategoryDTO(category);

		const { data, error } = await supabase.from('category').insert(categoryDTO).select();

		if (error) throw error;

		if (data) {
			return data[0];
		}
	}
}

export { CategoryDAO };
