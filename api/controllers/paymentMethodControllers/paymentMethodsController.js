// Status controller

import { PaymentMethodService } from '../../services/paymentMethod/paymentMethod.service.js';

const paymentMethodService = PaymentMethodService.getInstance();

const getPaymentMethodTypes = async (req, res, next) => {
	try {
		const paymentMethodTypes = await paymentMethodService.getPaymentMethodTypes();
		return res.json(paymentMethodTypes);
	} catch (err) {
		next(err);
	}
};

/**
 *
 * @description: Only for initial populate
 */
const populatePaymentMethodTypes = async (req, res, next) => {
	try {
		await paymentMethodService.populatePaymentMethodTypes();
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { populatePaymentMethodTypes, getPaymentMethodTypes };
