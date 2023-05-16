import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	order: {
		type: Number,
		required: true,
	},

	// relations
	parentCategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category',
	},
});

function autopopulate(next) {
	this.populate('parentCategory');
	next();
}

CategorySchema.pre('findById', autopopulate);
CategorySchema.pre('findOne', autopopulate);
CategorySchema.pre('find', autopopulate);

const CategoryDTO = mongoose.model('category', CategorySchema);

export { CategoryDTO };
