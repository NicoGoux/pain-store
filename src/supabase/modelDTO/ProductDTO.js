class ProductDTO {
	constructor(productObject) {
		this.id = productObject.id;
		this.name = productObject.name;
		this.market_hash_id = productObject.market_hash.id;
		this.skin_condition = productObject.skin_condition;
		this.float = productObject.float;
		this.image_url = productObject.image_url;
		this.trade_lock = productObject.trade_lock;
		this.price = productObject.price;
		this.product_status = productObject.product_status;
		this.creation_date = productObject.creation_date;
	}
}

export { ProductDTO };
