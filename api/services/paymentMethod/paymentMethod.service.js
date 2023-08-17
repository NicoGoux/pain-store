import { paymentMethodTypeStrings } from '../../config/paymentMethodTypeStrings.js';
import { PaymentMethodDAO } from '../../database/modelDAO/paymentMethod/paymentMethodDAO.js';
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
		this.paymentMethodDAO = new PaymentMethodDAO();
		this.paymentMethodTypeDAO = new PaymentMethodTypeDAO();
	}

	async getPaymentMethods(paymentMethodType) {
		paymentMethodType = await this.paymentMethodTypeDAO.getPaymentMethodType({
			paymentMethodTypeString: paymentMethodType,
		});

		return await this.paymentMethodDAO.getPaymentMethods(paymentMethodType);
	}

	async insertPaymentMethod(paymentMethodType, paymentMethodData) {
		paymentMethodType = await this.paymentMethodTypeDAO.getPaymentMethodType({
			paymentMethodTypeString: paymentMethodType,
		});

		if (
			paymentMethodType.paymentMethodTypeString ===
			paymentMethodTypeStrings.TRANSFERENCIA.name
		) {
			paymentMethodTypeStrings.TRANSFERENCIA.data.forEach((data) => {
				if (!Object.hasOwnProperty.call(paymentMethodData, data)) {
					throw new Error('The ' + data + ' data is missing');
				}
			});
		} else if (
			paymentMethodType.paymentMethodTypeString === paymentMethodTypeStrings.CRYPTOMONEDA.name
		) {
			paymentMethodTypeStrings.CRYPTOMONEDA.data.forEach((data) => {
				if (!Object.hasOwnProperty.call(paymentMethodData, data)) {
					throw new Error('The ' + data + ' data is missing');
				}
			});
		}

		return await this.paymentMethodDAO.insertPaymentMethod(
			paymentMethodType,
			paymentMethodData
		);
	}

	getPaymentMethodTypes() {
		return this.paymentMethodTypeDAO.getPaymentMethodTypes();
	}

	toggleActivePaymentMethod(id) {
		return this.paymentMethodDAO.toggleActivePaymentMethod(id);
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
