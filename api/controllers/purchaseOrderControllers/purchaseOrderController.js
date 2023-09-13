import { PurchaseOrderService } from '../../services/purchaseOrder/purchaseOrder.service.js';

const purchaseOrderService = PurchaseOrderService.getInstance();

// #region get purchase orders
const getPurchaseOrders = async (req, res, next) => {
	try {
		const filters = req.query;
		const purchaseOrders = await purchaseOrderService.getPurchaseOrders(filters);
		return res.json(purchaseOrders);
	} catch (err) {
		next(err);
	}
};

const getUserPurchaseOrders = async (req, res, next) => {
	try {
		const user = req.user;
		const purchaseOrders = await purchaseOrderService.getUserPurchaseOrders(user);
		return res.json(purchaseOrders);
	} catch (err) {
		next(err);
	}
};

const getUserPurchaseOrder = async (req, res, next) => {
	try {
		const user = req.user;
		const { id } = req.params;
		const purchaseOrder = await purchaseOrderService.getUserPurchaseOrder(user, id);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};

const getPurchaseOrder = async (req, res, next) => {
	try {
		const { id } = req.params;
		const purchaseOrder = await purchaseOrderService.getPurchaseOrder(id);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};

const getPurchaseOrderByProduct = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const purchaseOrder = await purchaseOrderService.getPurchaseOrderByProduct(productId);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};

//#endregion

// #region create purchase order
const createPurchaseOrder = async (req, res, next) => {
	try {
		const user = req.user;
		const { userData, products, paymentMethodType, isCart } = req.body;
		const purchaseOrder = await purchaseOrderService.createPurchaseOrder(
			user,
			userData,
			products,
			paymentMethodType,
			isCart
		);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};
//#endregion

// #region change status
const updatePurchaseOrderStatus = async (req, res, next) => {
	try {
		const { purchaseOrderId, purchaseOrderStatus } = req.body;
		const purchaseOrder = await purchaseOrderService.updatePurchaseOrderStatus(
			purchaseOrderId,
			purchaseOrderStatus
		);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};

const rejectPurchaseOrder = async (req, res, next) => {
	try {
		const user = req.user;
		const { purchaseOrderId } = req.body;
		const purchaseOrder = await purchaseOrderService.rejectPurchaseOrder(purchaseOrderId, user);
		return res.json(purchaseOrder);
	} catch (err) {
		next(err);
	}
};

// #endregion

export {
	getPurchaseOrders,
	getUserPurchaseOrders,
	getUserPurchaseOrder,
	getPurchaseOrder,
	getPurchaseOrderByProduct,
	createPurchaseOrder,
	updatePurchaseOrderStatus,
	rejectPurchaseOrder,
};
