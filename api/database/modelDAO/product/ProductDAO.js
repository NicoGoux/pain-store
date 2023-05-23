import boom from '@hapi/boom';
import { MarketHashDAO } from './MarketHashDAO.js';
import { SkinConditionDAO } from './SkinConditionDAO.js';
import { ProductStatusDAO } from './ProductStatusDAO.js';
import { ProductDTO } from '../../model/product/Product.js';
import { productStatusStrings } from '../../../config/productStatus.js';
import { CategoryDAO } from './CategoryDAO.js';

class ProductDAO {
	constructor() {}

	async getProducts(filters) {
		if (filters.minPrice != null) filters.minPrice = Number.parseFloat(filters.minPrice);
		if (filters.maxPrice != null) filters.maxPrice = Number.parseFloat(filters.maxPrice);
		if (filters.minFloat != null) filters.minFloat = Number.parseFloat(filters.minFloat);
		if (filters.minFloat != null) filters.maxFloat = Number.parseFloat(filters.maxFloat);

		const query = {
			name: { $regex: new RegExp(filters.name, 'i') },
			price: {
				$lte: filters.maxPrice || Number.MAX_SAFE_INTEGER,
				$gte: filters.minPrice || 0,
			},
			float: {
				$lte: filters.maxFloat || 1,
				$gte: filters.minFloat || 0,
			},
		};

		if (filters.category != null) {
			const categoryDAO = new CategoryDAO();
			const category = await categoryDAO.getCategory({ name: filters.category });
			const marketHashDAO = new MarketHashDAO();
			const marketHashesInCategory = await marketHashDAO.getMarketHashesInCategory(category);
			query.marketHash = { $in: marketHashesInCategory };
		}

		if (filters.condition != null) {
			const skinConditionDAO = new SkinConditionDAO();
			const skinCondition = await skinConditionDAO.getSkinCondition({
				skinConditionString: filters.condition,
			});
			query.skinCondition = skinCondition;
		}

		if (filters.nonTradeLock) {
			query.tradeLock = { $lt: Date.now() };
		}
		return await ProductDTO.find(query).lean();
	}

	async getProduct(id) {
		try {
			return await ProductDTO.findById(id).lean();
		} catch (error) {
			throw boom.notFound('Product not found');
		}
	}

	async insertProduct(product) {
		try {
			const marketHashDAO = new MarketHashDAO();
			const skinConditionDAO = new SkinConditionDAO();
			const productStatusDAO = new ProductStatusDAO();

			const marketHash = await marketHashDAO.insertMarketHash(product.marketHash);
			if (!marketHash) {
				throw boom.notFound('Market hash not found');
			}

			const skinCondition = await skinConditionDAO.getSkinCondition(product.skinCondition);
			if (!skinCondition) {
				throw boom.notFound('Skin condition not found');
			}

			const productStatus = await productStatusDAO.getProductStatus({
				productStatusString: 'DISPONIBLE',
			});
			if (!productStatus) {
				throw boom.notFound('Product status not found');
			}

			product.marketHash = marketHash;
			product.skinCondition = skinCondition;
			product.productStatus = productStatus;

			const productDTO = new ProductDTO(product);
			const productCreated = await productDTO.save();
			return productCreated;
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on insert product',
				statusCode: 409,
			});
		}
	}

	async updateProduct(id, patch) {
		try {
			const productUpdated = await ProductDTO.findByIdAndUpdate(id, patch, { new: true });

			return productUpdated;
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on update product',
				statusCode: 409,
			});
		}
	}

	async getAvailableProductsFromList(products) {
		const productsAvailable = [];

		await Promise.all(
			products.map(async (product) => {
				const isAvailable = await this.checkAvailableStatus(product);
				if (isAvailable) {
					productsAvailable.push(product);
				}
			})
		);

		return productsAvailable;
	}

	async checkAvailableStatus(product) {
		const productFound = await this.getProduct(product._id);
		return productFound.productStatus.productStatusString === productStatusStrings.DISPONIBLE;
	}
}

export { ProductDAO };
