import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductStatusSchema = new Schema({
	productStatusString: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
});

const ProductStatusDTO = mongoose.model('product_status', ProductStatusSchema);

export { ProductStatusDTO };
