import { ProductDAO } from '../../database/modelDAO/product/ProductDAO.js';

let instance;

class ProductService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new ProductService();
		}
	}
	constructor() {
		this.productDAO = new ProductDAO();
	}

	getProducts() {
		return this.productDAO.getProducts();
	}

	getProduct(id) {
		return this.productDAO.getProduct(id);
	}

	addProduct(product) {
		return this.productDAO.insertProduct(product);
	}

	updateProduct(id, patch) {
		return this.productDAO.updateProduct(id, patch);
	}
}

export { ProductService };
