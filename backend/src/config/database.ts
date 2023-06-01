// config/database.ts
import mongoose from "mongoose";

const connectDb = async () => {
	try {
		const conn = await mongoose.connect(
			process.env.MONGODB_URI || "mongodb://localhost:27017/TBR",
			{}
		);
		console.log(`MongoDB is connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(`Error: ${(err as Error).message}`);
		process.exit(1);
	}
};

export default connectDb;
