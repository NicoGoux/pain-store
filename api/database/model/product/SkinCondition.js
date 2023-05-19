import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SkinConditionSchema = new Schema({
	skinConditionString: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	initials: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
});

const SkinConditionDTO = mongoose.model('skin_condition', SkinConditionSchema);

export { SkinConditionDTO };
