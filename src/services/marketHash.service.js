import { MarketHashDAO } from '../database/modelDAO/MarketHashDAO.js';

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

	getMarketHashes() {
		return this.marketHashDAO.getMarketHashes();
	}

	insertMarketHash(marketHash) {
		return this.marketHashDAO.insertMarketHash(marketHash);
	}
}

export { MarketHashService };
