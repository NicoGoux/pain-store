import boom from '@hapi/boom';
import { PurchaseOrderStatusDTO } from '../../model/PurchaseOrder/PurchaseOrderStatus.js';

class PurchaseOrderStatusDAO {
	constructor() {}

	async getPurchaseOrderStatus(purchaseOrderStatus) {
		return await PurchaseOrderStatusDTO.findOne({
			purchaseOrderStatusString: purchaseOrderStatus.purchaseOrderStatusString,
		});
	}

	async getPurchaseOrderStatuses() {
		return await PurchaseOrderStatusDTO.find();
	}

	async insertPurchaseOrderStatus(purchaseOrderStatus) {
		try {
			const purchaseOrderStatusDTO = new PurchaseOrderStatusDTO(purchaseOrderStatus);
			const purchaseOrderStatusSaved = await purchaseOrderStatusDTO.save();
			if (purchaseOrderStatusSaved) {
				return purchaseOrderStatus;
			}
		} catch (err) {
			throw err;
		}
	}

	async insertPurchaseOrderStatuses(purchaseOrderStatuses) {
		const purchaseOrderStatusInserted = await Promise.all(
			purchaseOrderStatuses.map(await this.insertPurchaseOrderStatus)
		).catch((err) => {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on insert purchase order status',
				statusCode: 409,
			});
		});

		return purchaseOrderStatusInserted;
	}
}

export { PurchaseOrderStatusDAO };
