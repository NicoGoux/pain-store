// Status controller

import { PaymentMethodService } from '../../services/paymentMethod/paymentMethod.service.js';

const paymentMethodService = PaymentMethodService.getInstance();

const getPaymentMethods = async (req, res, next) => {
	try {
		const paymentMethods = await paymentMethodService.getPaymentMethod();
		return res.json(paymentMethods);
	} catch (err) {
		next(err);
	}
};

/**
 *
 * @description: Only for initial populate
 */
const populatePaymentMethods = async (req, res, next) => {
	try {
		await paymentMethodService.populatePaymentMethods();
		next();
		return;
	} catch (err) {
		next(err);
	}
};

export { populatePaymentMethods, getPaymentMethods };
