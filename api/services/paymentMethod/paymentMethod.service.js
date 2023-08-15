import { purchaseOrderStatusStrings } from '../../config/purchaseOrderStatus.js';

let instance;

class PaymentMethodService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new PaymentMethodService();
		}
	}

	constructor() {
		// this.paymentMethodDAO = new PaymentMethodDAO();
	}

	getPaymentMethods() {
		return this.paymentMethodDAO.getPaymentMethods();
	}

	getPurchaseOrder(id) {
		return this.purchaseOrderDAO.getPurchaseOrder(id);
	}
}

export { PurchaseOrderService };
