import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentMethodTypeSchema = new Schema({
	paymentMethodTypeString: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
});

const PaymentMethodTypeDTO = mongoose.model('payment_method_type', PaymentMethodTypeSchema);

export { PaymentMethodTypeDTO };
