import { MarketHashService } from '../../services/product/marketHash.service.js';

const marketHashService = MarketHashService.getInstance();

const getMarketHashes = async (req, res, next) => {
	try {
		const filters = req.query;
		// TODO obtener por categoria
		const marketHashes = await marketHashService.getMarketHashes(filters);
		return res.json(marketHashes);
	} catch (err) {
		next(err);
	}
};

const insertMarketHash = async (req, res, next) => {
	try {
		const { marketHash } = req.body;
		const marketHashInserted = await marketHashService.insertMarketHash(marketHash);
		return res.json(marketHashInserted);
	} catch (err) {
		next(err);
	}
};

export { insertMarketHash, getMarketHashes };
