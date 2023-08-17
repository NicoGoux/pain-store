// Status controller

import { PaymentMethodService } from '../../services/paymentMethod/paymentMethod.service.js';

const paymentMethodService = PaymentMethodService.getInstance();

const insertPaymentMethod = async (req, res, next) => {
	try {
		const { paymentMethodType, paymentMethodData } = req.body;
		const paymentMethodAdded = await paymentMethodService.insertPaymentMethod(
			paymentMethodType,
			paymentMethodData
		);
		return res.json(paymentMethodAdded);
	} catch (err) {
		next(err);
	}
};

const getPaymentMethodTypes = async (req, res, next) => {
	try {
		const paymentMethodTypes = await paymentMethodService.getPaymentMethodTypes();
		return res.json(paymentMethodTypes);
	} catch (err) {
		next(err);
	}
};

const getPaymentMethods = async (req, res, next) => {
	try {
		const { paymentMethodType } = req.params;
		const paymentMethods = await paymentMethodService.getPaymentMethods(paymentMethodType);
		return res.json(paymentMethods);
	} catch (err) {
		next(err);
	}
};

const toggleActivePaymentMethod = async (req, res, next) => {
	try {
		const { id } = req.params;
		const paymentMethodTypes = await paymentMethodService.toggleActivePaymentMethod(id);
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

export {
	insertPaymentMethod,
	getPaymentMethods,
	getPaymentMethodTypes,
	toggleActivePaymentMethod,
	populatePaymentMethodTypes,
};
