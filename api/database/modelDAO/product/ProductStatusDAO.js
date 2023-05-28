import { ProductStatusDTO } from '../../model/product/ProductStatus.js';

class ProductStatusDAO {
	constructor() {}

	async getProductStatus(productStatus) {
		return await ProductStatusDTO.findOne({
			productStatusString: productStatus.productStatusString,
		});
	}

	async getProductStatuses() {
		return await ProductStatusDTO.find();
	}

	async insertProductStatus(productStatus) {
		try {
			const productStatusDTO = new ProductStatusDTO(productStatus);
			const productStatusSaved = productStatusDTO.save();
			if (productStatusSaved) {
				return productStatus;
			}
		} catch (err) {
			throw err;
		}
	}

	async insertProductStatuses(productStatuses) {
		const productStatusInserted = await Promise.all(
			productStatuses.map(await this.insertProductStatus)
		).catch((err) => {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on insert product status',
				statusCode: 409,
			});
		});

		return productStatusInserted;
	}
}

export { ProductStatusDAO };
