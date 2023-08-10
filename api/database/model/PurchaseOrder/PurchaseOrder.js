import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
		unique: true,
	},

	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'product',
		},
	],

	paymentMethod: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},

	totalPrice: {
		type: Number,
		require: true,
	},

	// TODO
	// PurchaseOrderStatus: {

	// }
});

function autopopulate(next) {
	this.populate('user');
	this.populate('products');
	next();
}

PurchaseOrderSchema.pre('findById', autopopulate);
PurchaseOrderSchema.pre('findOne', autopopulate);
PurchaseOrderSchema.pre('find', autopopulate);

const PurchaseOrderDTO = mongoose.model('purchase_order', PurchaseOrderSchema);

export { PurchaseOrderDTO };
