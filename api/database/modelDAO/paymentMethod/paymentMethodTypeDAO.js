import boom from '@hapi/boom';
import { PaymentMethodTypeDTO } from '../../model/paymentMethod/PaymentMethodType.js';

class PaymentMethodTypeDAO {
	constructor() {}

	async getPaymentMethodType(paymentMethodType) {
		return await PaymentMethodTypeDTO.findOne({
			paymentMethodTypeString: paymentMethodType.paymentMethodTypeString,
		});
	}

	async getPaymentMethodTypes() {
		return await PaymentMethodTypeDTO.find();
	}

	async insertPaymentMethodType(paymentMethodType) {
		try {
			const paymentMethodTypeDTO = new PaymentMethodTypeDTO(paymentMethodType);
			const paymentMethodTypeSaved = await paymentMethodTypeDTO.save();
			if (paymentMethodTypeSaved) {
				return paymentMethodType;
			}
		} catch (err) {
			throw err;
		}
	}

	async insertPaymentMethodTypes(paymentMethodTypes) {
		const paymentMethodTypesInserted = await Promise.all(
			paymentMethodTypes.map(await this.insertPaymentMethodType)
		).catch((err) => {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				message: 'Conflict on insert payment method types',
				statusCode: 409,
			});
		});

		return paymentMethodTypesInserted;
	}
}

export { PaymentMethodTypeDAO };
