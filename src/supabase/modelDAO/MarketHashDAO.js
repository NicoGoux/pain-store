import { supabase } from '../SupabaseClient.js';
import { MarketHashDTO } from '../modelDTO/MarketHashDTO.js';
import { CategoryService } from '../../services/category.service.js';

class MarketHashDAO {
	constructor() {}

	//TODO Bomm error

	async insertMarketHash(market_hash) {
		const category = await CategoryService.getInstance().getCategory(market_hash.category);

		if (category) {
			market_hash.category = category;

			const market_hash_DTO = new MarketHashDTO(market_hash);

			console.table(market_hash_DTO);

			const { data, error } = await supabase
				.from('market_hash')
				.insert(market_hash_DTO)
				.select();

			if (error) throw error;

			if (data) {
				return data[0];
			}
		} else {
			throw new Error("The category doesn't exist");
		}
	}

	async getMarketHash(market_hash) {
		const { data, error } = await supabase
			.from('market_hash')
			.select()
			.eq('market_hash', market_hash.market_hash);

		if (error) throw error;

		if (data && data.length != 0) {
			return data[0];
		} else {
			return false;
		}
	}
}

export { MarketHashDAO };
