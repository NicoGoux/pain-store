import { PurchaseOrderService } from '../../services/purchaseOrder/purchaseOrder.service.js';

const purchaseOrderService = PurchaseOrderService.getInstance();

// #region create purchase order
const createPurchaseOrder = async (req, res, next) => {
	try {
		const user = req.user;
		const { products, paymentMethod, isCart } = req.body;
		const purchaseOrder = await purchaseOrderService.createPurchaseOrder(
			user,
			products,
			paymentMethod,
			isCart
		);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};

//#endregion

export { createPurchaseOrder };
