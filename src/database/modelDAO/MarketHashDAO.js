import { MarketHashDTO } from '../model/product/MarketHash.js';
import { CategoryDAO } from './CategoryDAO.js';
import boom from '@hapi/boom';

class MarketHashDAO {
	constructor() {}

	async getMarketHash(marketHash) {
		return await MarketHashDTO.findOne({
			marketHashString: marketHash.marketHashString,
		}).populate('category');
	}

	async getMarketHashes() {
		return await MarketHashDTO.find().populate('category');
	}

	async insertMarketHash(marketHash) {
		try {
			const existingMarketHash = await this.getMarketHash(marketHash);
			if (existingMarketHash) {
				return existingMarketHash;
			}

			const categoryDAO = new CategoryDAO();
			const category = await categoryDAO.getCategory(marketHash.category);
			if (!category) {
				throw boom.notFound('Category not found');
			}

			marketHash.category = category;
			const marketHashDTO = new MarketHashDTO(marketHash);
			return await marketHashDTO.save();
		} catch (error) {
			throw error;
		}
	}

	// Only for populate
	async insertMarketHashes(marketHashes) {
		const marketHashesInserted = await Promise.all(
			marketHashes.map(await this.insertMarketHash)
		).catch((error) => {
			throw boom.boomify(error, {
				message: 'Conflict on insert market hash',
				statusCode: 409,
			});
		});

		return marketHashesInserted;
	}
}

export { MarketHashDAO };
