import { MarketHashDAO } from '../../database/modelDAO/product/MarketHashDAO.js';

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

	getMarketHash(market_hash) {
		return this.marketHashDAO.getMarketHash(market_hash);
	}

	getMarketHashes(filters) {
		return this.marketHashDAO.getMarketHashes(filters);
	}

	insertMarketHash(marketHash) {
		return this.marketHashDAO.insertMarketHash(marketHash);
	}
}

export { MarketHashService };
