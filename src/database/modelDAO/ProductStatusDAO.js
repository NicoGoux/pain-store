import { ProductStatusDTO } from '../model/product/ProductStatus.js';

class ProductStatusDAO {
	constructor() {}

	async getProductStatus(productStatus) {
		return await ProductStatusDTO.findOne({
			productStatusString: productStatus.productStatusString,
		});
	}

	async insertProductStatus(productStatus) {
		try {
			const productStatusDTO = new ProductStatusDTO(productStatus);
			const productStatusSaved = productStatusDTO.save();
			if (productStatusSaved) {
				return productStatus;
			}
		} catch (error) {
			throw error;
		}
	}

	async insertProductStatuses(productStatuses) {
		const productStatusInserted = await Promise.all(
			productStatuses.map(await this.insertProductStatus)
		).catch((error) => {
			throw boom.boomify(error, {
				message: 'Conflict on insert product status',
				statusCode: 409,
			});
		});

		return productStatusInserted;
	}
}

export { ProductStatusDAO };
