import { purchaseOrderStatusStrings } from '../../config/purchaseOrderStatus.js';
import { PurchaseOrderDAO } from '../../database/modelDAO/purchaseOrder/PurchaseOrderDAO.js';
import { PurchaseOrderStatusDAO } from '../../database/modelDAO/purchaseOrder/PurchaseOrderStatusDAO.js';

let instance;

class PurchaseOrderService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new PurchaseOrderService();
		}
	}

	constructor() {
		this.purchaseOrderDAO = new PurchaseOrderDAO();
		this.purchaseOrderStatusDAO = new PurchaseOrderStatusDAO();
	}

	getPurchaseOrders() {
		return this.purchaseOrderDAO.getPurchaseOrders();
	}

	getUserPurchaseOrders(user) {
		return this.purchaseOrderDAO.getPurchaseOrders({
			user: user.sub,
		});
	}

	getPurchaseOrder(id) {
		return this.purchaseOrderDAO.getPurchaseOrder(id);
	}

	async createPurchaseOrder(user, userData, products, paymentMethod, isCart) {
		return await this.purchaseOrderDAO.createPurchaseOrder({
			user: user.sub,
			...userData,
			products: products,
			paymentMethod: paymentMethod,
			isCart: isCart,
		});
	}

	async updatePurchaseOrderStatus(purchaseOrderId, purchaseOrderStatus) {
		purchaseOrderStatus = await this.purchaseOrderStatusDAO.getPurchaseOrderStatus({
			purchaseOrderStatusString: purchaseOrderStatus,
		});

		return await this.purchaseOrderDAO.updatePurchaseOrderStatus(
			purchaseOrderId,
			purchaseOrderStatus
		);
	}

	getPurchaseOrderStatuses() {
		return this.purchaseOrderStatusDAO.getPurchaseOrderStatuses();
	}

	/**
	 *
	 * @description: Only for initial populate
	 */
	async populatePurchaseOrderStatuses() {
		const purchaseOrderStatuses = [
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.RECHAZADO,
			},
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.PENDPAGO,
			},
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.PENDENVIO,
			},
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.FINALIZADO,
			},
		];
		return await this.purchaseOrderStatusDAO.insertPurchaseOrderStatuses(purchaseOrderStatuses);
	}
}

export { PurchaseOrderService };
