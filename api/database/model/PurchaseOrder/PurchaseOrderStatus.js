import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PurchaseOrderStatusSchema = new Schema({
	purchaseOrderStatusString: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
});

const PurchaseOrderStatusDTO = mongoose.model('purchase_order_status', PurchaseOrderStatusSchema);

export { PurchaseOrderStatusDTO };
