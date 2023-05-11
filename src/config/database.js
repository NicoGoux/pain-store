import mongoose from 'mongoose';
import cLog from '../utils/cLog.js';

const connectDB = async () => {
	try {
		const uri = process.env.MONGODB_URI;

		const connection = await mongoose.connect(uri, {
			//TODO
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		cLog.cyan(`[Mongoose] Database connected\n`);
	} catch (err) {
		cLog.red(`[Mongoose] Error connecting to database`);
		throw err;
	}
};

export { connectDB };
