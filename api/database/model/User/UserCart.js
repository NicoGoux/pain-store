import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserCartSchema = new Schema({
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
});

function autopopulate(next) {
	this.populate('user');
	this.populate('products');
	next();
}

UserCartSchema.pre('findById', autopopulate);
UserCartSchema.pre('findOne', autopopulate);
UserCartSchema.pre('find', autopopulate);

const UserCartDTO = mongoose.model('user_cart', UserCartSchema);

export { UserCartDTO };
