class MarketHashDTO {
	constructor(marketHashObject) {
		if (marketHashObject.id != null) {
			this.id = marketHashObject.id;
		} else {
			delete this.id;
		}
		this.market_hash = marketHashObject.market_hash;
		this.category_id = marketHashObject.category.id;
	}
}

export { MarketHashDTO };
