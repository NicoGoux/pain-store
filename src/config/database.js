import mongoose from 'mongoose';
import cLog from './cLog.js';

const connectDB = async () => {
	try {
		const uri = process.env.MONGODB_URI;

		const connection = await mongoose.connect(uri, {
			//TODO
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		cLog.cyan(`[Mongoose] Database connected\n`);
	} catch (error) {
		cLog.red(`[Mongoose] Error connecting to database`);
		throw error;
	}
};

export { connectDB };
