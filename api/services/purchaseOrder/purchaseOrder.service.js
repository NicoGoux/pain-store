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

	async createPurchaseOrder(user, products, paymentMethod, isCart) {
		return { user: user, products: products, paymentMethod: paymentMethod, isCart: isCart };
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
				purchaseOrderStatusString: 'RECHAZADO',
			},
			{
				purchaseOrderStatusString: 'PENDIENTE DE PAGO',
			},
			{
				purchaseOrderStatusString: 'PENDIENTE DE ENVIÓ',
			},
			{
				purchaseOrderStatusString: 'FINALIZADO',
			},
		];
		return await this.purchaseOrderStatusDAO.insertPurchaseOrderStatuses(purchaseOrderStatuses);
	}
}

export { PurchaseOrderService };
