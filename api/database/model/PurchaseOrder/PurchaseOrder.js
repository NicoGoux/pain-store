import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
	orderNumber: {
		type: Number,
		required: true,
		unique: true,
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},

	firstName: {
		type: String,
		trim: true,
		required: true,
	},

	lastName: {
		type: String,
		trim: true,
		required: true,
	},

	tradeLink: {
		type: String,
		trim: true,
		required: true,
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

	purchaseOrderStatus: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'purchase_order_status',
		require: true,
	},
});

function autopopulate(next) {
	this.populate('user');
	this.populate('products');
	this.populate('purchaseOrderStatus');
	next();
}

PurchaseOrderSchema.pre('findById', autopopulate);
PurchaseOrderSchema.pre('findOne', autopopulate);
PurchaseOrderSchema.pre('find', autopopulate);

const PurchaseOrderDTO = mongoose.model('purchase_order', PurchaseOrderSchema);

export { PurchaseOrderDTO };
