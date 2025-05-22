import mongoose from "mongoose";
import { MONGO_URI } from "../config/constants";

export default async function connectDB(): Promise<void> {
	mongoose.Promise = global.Promise; // Use global Promise for mongoose
	try {
		mongoose.connection.on("connected", () => {
			console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
		});

		mongoose.connection.on("disconnected", () => {
			console.error("❌ MongoDB disconnected");
		});

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

		await mongoose.connect(MONGO_URI);
	} catch (error) {
		console.error(`❌ Error connecting to MongoDB: ${error}`);
		process.exit(1);
	}
};