import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
	paymentMethodType: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'payment_method_type',
		require: true,
	},

	paymentMethodData: {
		type: mongoose.Schema.Types.Mixed,
		require: true,
	},

	isActive: {
		type: Boolean,
		default: true,
	},
});

const PaymentMethodDTO = mongoose.model('payment_method', PaymentMethodSchema);

export { PaymentMethodDTO };
