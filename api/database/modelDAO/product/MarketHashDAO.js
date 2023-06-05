import { MarketHashDTO } from '../../model/product/MarketHash.js';
import { CategoryDAO } from './CategoryDAO.js';
import boom from '@hapi/boom';

class MarketHashDAO {
	constructor() {}

	async getMarketHash(marketHash) {
		return await MarketHashDTO.findOne({
			marketHashString: marketHash.marketHashString,
		});
	}

	async getMarketHashes(filters) {
		const query = {};
		let limit = 0;
		if (filters) {
			if (filters.marketHash) {
				const remplacedFilter = filters.marketHash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				query.marketHashString = { $regex: new RegExp('^' + remplacedFilter, 'i') };
			}

			if (filters.category) {
				const categoryDAO = new CategoryDAO();
				const category = await categoryDAO.getCategory({ name: filters.category });
				query.category = category;
			}
			if (filters.limit) {
				limit = filters.limit;
			}
		}

		return await MarketHashDTO.find(query).limit(limit);
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
		} catch (err) {
			throw err;
		}
	}

	async updateMarketHash(id, patch) {
		try {
			if (patch.category != null) {
				const categoryDAO = new CategoryDAO();
				const category = await categoryDAO.getCategory({ name: patch.category });
				if (!category) {
					throw boom.notFound('Category not found');
				}
				patch.category = category;
			}
			const marketHashUpdated = await MarketHashDTO.findByIdAndUpdate(id, patch, {
				new: true,
			});
			return marketHashUpdated;
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on update product',
				statusCode: 409,
			});
		}
	}

	// Only for populate
	async insertMarketHashes(marketHashes) {
		const marketHashesInserted = await Promise.all(
			marketHashes.map(await this.insertMarketHash)
		).catch((err) => {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on insert market hash',
				statusCode: 409,
			});
		});

		return marketHashesInserted;
	}
}

export { MarketHashDAO };
