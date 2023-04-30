import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		float: {
			type: Number,
		},

		tradeLock: {
			type: Date,
		},

		price: {
			type: Number,
			require: true,
		},

		// relations
		marketHash: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'market_hash',
			require: true,
		},

		skinCondition: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'skin_condition',
		},

		productStatus: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'product_status',
			require: true,
		},
	},
	{ timestamps: true }
);

const ProductDTO = mongoose.model('product', ProductSchema);

export { ProductDTO };
