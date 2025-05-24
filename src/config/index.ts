import {
	MONGO_URI,
	AES_ALGORITHM,
    AES_KEY,
	JWT_REFRESH_SECRET,
	JWT_SECRET,
	COOKIE_SECRET,
	COOKIE_NAME,
	NODE_ENV,
    PORT,
} from "./constants";

import connectDB from "./database.config";

export {
	NODE_ENV,
    PORT,
	MONGO_URI,
	AES_ALGORITHM,
    AES_KEY,
	JWT_SECRET,
	JWT_REFRESH_SECRET,
	COOKIE_SECRET,
	COOKIE_NAME,
    connectDB,
};
