import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
	paymentMethod: {
		type: String,
		trim: true,
		required: true,
	},

	paymentMethodData: {
		type: mongoose.Schema.Types.Mixed,
		require: true,
	},
});

const PaymentMethodDTO = mongoose.model('payment_method', PaymentMethodSchema);

export { PaymentMethodDTO };
