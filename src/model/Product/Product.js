class Product {
	constructor(
		pk_product,
		name,
		market_hash,
		skin_condition,
		float,
		trade_lock,
		price,
		product_status,
		creation_date
	) {
		this.pkProduct = pk_product;
		this.name = name;
		this.marketHash = market_hash;
		this.skinCondition = skin_condition;
		this.float = float;
		this.tradeLock = trade_lock;
		this.price = price;
		this.productStatus = product_status;
		this.creationDate = creation_date;
	}
}

export { Product };
