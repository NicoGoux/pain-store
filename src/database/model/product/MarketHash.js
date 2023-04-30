import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MarketHashSchema = new Schema({
	marketHashString: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},

	// relations
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category',
	},
});

const MarketHashDTO = mongoose.model('market_hash', MarketHashSchema);

export { MarketHashDTO };
