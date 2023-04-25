import { MarketHashService } from '../../services/marketHash.service';

class ProductDAO {
	constructor() {}

	//TODO Bomm error

	async insertProduct(product) {
		const market_hash = await MarketHashService.getInstance().getMarketHash(
			product.market_hash
		);

		if (!marketHashInBd) {
			return MarketHashService.getInstance().insertMarketHash(product.market_hash);
		}
	}
}
