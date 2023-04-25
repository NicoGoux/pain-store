import { MarketHashDAO } from '../supabase/modelDAO/MarketHashDAO.js';
import { MarketHash } from '../model/Product/MarketHash.js';
import { Category } from '../model/Product/Category.js';

let instance;

class MarketHashService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new MarketHashService();
		}
	}

	constructor() {
		this.marketHashDAO = new MarketHashDAO();
	}

	insertMarketHash(market_hash) {
		return this.marketHashDAO.insertMarketHash(market_hash);
	}

	getMarketHash(market_hash) {
		return this.marketHashDAO.getMarketHash(market_hash);
	}
}

export { MarketHashService };
