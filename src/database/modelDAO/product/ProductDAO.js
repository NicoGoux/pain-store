import boom from '@hapi/boom';
import { MarketHashDAO } from './MarketHashDAO.js';
import { SkinConditionDAO } from './SkinConditionDAO.js';
import { ProductStatusDAO } from './ProductStatusDAO.js';
import { ProductDTO } from '../../model/product/Product.js';

class ProductDAO {
	constructor() {}

	async getProducts() {
		return await ProductDTO.find().lean();
	}

	async getProduct(id) {
		return await ProductDTO.findById(id).lean();
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
			throw boom.boomify(err, {
				message: 'Conflict on update product',
				statusCode: 409,
			});
		}
	}
}

export { ProductDAO };
