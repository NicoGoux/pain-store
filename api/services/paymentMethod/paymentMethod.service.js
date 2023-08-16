import { paymentMethodTypeStrings } from '../../config/paymentMethodTypeStrings.js';
import { PaymentMethodTypeDAO } from '../../database/modelDAO/paymentMethod/paymentMethodTypeDAO.js';

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
		this.paymentMethodTypeDAO = new PaymentMethodTypeDAO();
	}

	getPaymentMethods() {
		// return this.paymentMethodDAO.getPaymentMethods();
	}

	getPaymentMethodTypes() {
		return this.paymentMethodTypeDAO.getPaymentMethodTypes();
	}

	/**
	 *
	 * @description: Only for initial populate
	 */
	async populatePaymentMethodTypes() {
		const paymentMethodTypes = [
			{
				paymentMethodTypeString: paymentMethodTypeStrings.TRANSFERENCIA.name,
			},
			{
				paymentMethodTypeString: paymentMethodTypeStrings.CRYPTOMONEDA.name,
			},
		];
		return await this.paymentMethodTypeDAO.insertPaymentMethodTypes(paymentMethodTypes);
	}
}

export { PaymentMethodService };
