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
		};

		if (filters.category != null) {
			const marketHashDAO = new MarketHashDAO();
			const marketHashesInCategory = await marketHashDAO.getMarketHashes({
				marketHashString: '',
				category: filters.category,
			});
			query.marketHash = { $in: marketHashesInCategory };
		}

		if (filters.condition != null) {
			const skinConditionDAO = new SkinConditionDAO();
			const skinCondition = await skinConditionDAO.getSkinCondition({
				skinConditionString: filters.condition,
			});
			query.skinCondition = skinCondition;
		}

		if (filters.minFloat || filters.maxFloat) {
			query.float = {
				$lte: filters.maxFloat || 1,
				$gte: filters.minFloat || 0,
			};
		}

		if (filters.nonTradeLock) {
			query.tradeLock = { $lt: Date.now() };
		}

		if (filters.productStatus != null) {
			query.productStatus = filters.productStatus;
		}
		return await ProductDTO.find(query).lean();
	}

	async getProduct(id) {
		try {
			return await ProductDTO.findById(id).lean();
		} catch (err) {
			throw boom.notFound('Product not found');
		}
	}

	async insertProduct(product) {
		try {
			const marketHashDAO = new MarketHashDAO();
			const productStatusDAO = new ProductStatusDAO();

			const marketHash = await marketHashDAO.insertMarketHash(product.marketHash);
			if (!marketHash) {
				throw boom.notFound('Market hash not found');
			}

			const productStatus = await productStatusDAO.getProductStatus({
				productStatusString: 'DISPONIBLE',
			});
			if (!productStatus) {
				throw boom.notFound('Product status not found');
			}

			product.marketHash = marketHash;
			product.productStatus = productStatus;

			// only if the product has skin condition
			if (product.skinCondition) {
				const skinConditionDAO = new SkinConditionDAO();
				const skinCondition = await skinConditionDAO.getSkinCondition(
					product.skinCondition
				);
				if (!skinCondition) {
					throw boom.notFound('Skin condition not found');
				}
				product.skinCondition = skinCondition;
			}

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
			const productFound = await this.getProduct(id);

			if (patch.skinCondition != null) {
				const skinConditionDAO = new SkinConditionDAO();
				const skinCondition = await skinConditionDAO.getSkinCondition({
					skinConditionString: patch.skinCondition,
				});
				if (!skinCondition) {
					throw boom.notFound('Skin condition not found');
				}
				patch.skinCondition = skinCondition;
			}
			if (patch.productStatus != null) {
				const productStatusDAO = new ProductStatusDAO();
				const productStatus = await productStatusDAO.getProductStatus({
					productStatusString: patch.productStatus,
				});
				if (!productStatus) {
					throw boom.notFound('Product status not found');
				}
				patch.productStatus = productStatus;
			}

			if (patch.marketHash != null || patch.category != null) {
				const marketHashDAO = new MarketHashDAO();
				if (patch.marketHash != null) {
					if (patch.marketHash != productFound.marketHash.marketHashString) {
						let newMarketHash = {
							marketHashString: patch.marketHash,
							category: {
								name: productFound.marketHash.category.name,
							},
						};
						if (patch.category) {
							newMarketHash.category.name = patch.category;
						}
						const newMarketHashObject = await marketHashDAO.insertMarketHash(
							newMarketHash
						);
						patch.marketHash = newMarketHashObject;
					} else {
						const marketHashUpdated = await marketHashDAO.updateMarketHash(
							productFound.marketHash._id,
							{ category: patch.category }
						);
						patch.marketHash = marketHashUpdated;
					}
				} else {
					const marketHashUpdated = await marketHashDAO.updateMarketHash(
						productFound.marketHash._id,
						{ category: patch.category }
					);
					patch.marketHash = marketHashUpdated;
				}
				delete patch.category;
			}

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
