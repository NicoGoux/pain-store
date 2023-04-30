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

const CategoryDTO = mongoose.model('category', CategorySchema);

export { CategoryDTO };
