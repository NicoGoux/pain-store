import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			inmutable: true,
		},
		emailConfirm: {
			type: Boolean,
			default: false,
		},
		emailConfirmToken: {
			type: String,
			unique: true,
		},
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
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
		password: {
			type: String,
			trim: true,
			required: true,
			// select: false,
		},

		recoveryToken: {
			type: String,
			unique: true,
		},
		role: {
			type: String,
			default: 'CUSTOMER',
		},
	},
	{ timestamps: true }
);

const UserDTO = mongoose.model('user', UserSchema);

export { UserDTO };
