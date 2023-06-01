import { productStatusStrings } from '../../config/productStatus.js';
import { ProductDAO } from '../../database/modelDAO/product/ProductDAO.js';
import { ProductStatusDAO } from '../../database/modelDAO/product/ProductStatusDAO.js';

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
		this.productStatusDAO = new ProductStatusDAO();
	}

	//#region get products
	async getProducts(filters) {
		if (filters.productStatus) {
			const productStatusObject = await this.productStatusDAO.getProductStatus({
				productStatusString: filters.productStatus,
			});
			filters.productStatus = productStatusObject;
		}
		return this.productDAO.getProducts(filters);
	}

	async getAvailableProducts(filters) {
		const productStatusAvailable = await this.productStatusDAO.getProductStatus({
			productStatusString: productStatusStrings.DISPONIBLE,
		});

		filters.productStatus = productStatusAvailable;

		return this.productDAO.getProducts(filters);
	}

	getProduct(id) {
		return this.productDAO.getProduct(id);
	}

	//#endregion

	addProduct(product) {
		return this.productDAO.insertProduct(product);
	}

	updateProduct(id, patch) {
		return this.productDAO.updateProduct(id, patch);
	}

	getProductStatuses() {
		return this.productStatusDAO.getProductStatuses();
	}
}

export { ProductService };
