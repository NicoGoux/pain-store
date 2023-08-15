import { PurchaseOrderService } from '../../services/purchaseOrder/purchaseOrder.service.js';

const purchaseOrderService = PurchaseOrderService.getInstance();

const getPurchaseOrderStatuses = async (req, res, next) => {
	try {
		const purchaseOrderStatuses = await purchaseOrderService.getPurchaseOrderStatuses();
		return res.json(purchaseOrderStatuses);
	} catch (err) {
		next(err);
	}
};
/**
 *
 * @description: Only for initial populate
 */
const populatePurchaseOrderStatuses = async (req, res, next) => {
	try {
		await purchaseOrderService.populatePurchaseOrderStatuses();
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { populatePurchaseOrderStatuses, getPurchaseOrderStatuses };
