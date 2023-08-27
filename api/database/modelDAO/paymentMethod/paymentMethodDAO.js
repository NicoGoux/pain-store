import { PaymentMethodDTO } from '../../model/paymentMethod/PaymentMethod.js';

class PaymentMethodDAO {
	constructor() {}

	async getPaymentMethods(paymentMethodType) {
		if (!paymentMethodType) {
			return await PaymentMethodDTO.find();
		}
		return await PaymentMethodDTO.find({ paymentMethodType: paymentMethodType });
	}

	async getAvailablePaymentMethods(paymentMethodType) {
		if (!paymentMethodType) {
			return await PaymentMethodDTO.find({ isActive: true });
		}
		return await PaymentMethodDTO.find({
			paymentMethodType: paymentMethodType,
			isActive: true,
		});
	}
	async checkAvailableMethodType(paymentMethodType) {
		return await PaymentMethodDTO.findOne({
			paymentMethodType: paymentMethodType,
			isActive: true,
		});
	}

	async insertPaymentMethod(paymentMethodType, paymentMethodData) {
		const paymentMethodDTO = new PaymentMethodDTO({
			paymentMethodType: paymentMethodType,
			paymentMethodData: paymentMethodData,
		});
		return await paymentMethodDTO.save();
	}

	async toggleActivePaymentMethod(id) {
		const paymentMethod = await PaymentMethodDTO.findById(id);
		paymentMethod.isActive = !paymentMethod.isActive;
		return await paymentMethod.save({ new: true });
	}
}

export { PaymentMethodDAO };