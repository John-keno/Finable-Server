import dotenv from "dotenv";

// Determine the environment and load the corresponding file
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";
dotenv.config({ path: envFile });

export const getEnvironmentVariable = (
	key: string,
	defaultVal?: string
): string => {
	const value = process.env[key] || defaultVal;
	if (value === undefined) {
		throw new Error(`Environment variable ${key} is undefined`);
	}
	return value;
};

export const getEnvironmentVariableNumber = (
	key: string,
	defaultVal?: number
): number => {
	const value = process.env[key] || defaultVal;
	if (value === undefined) {
		throw new Error(`Environment variable ${key} is undefined`);
	}
	return Number(value);
};

export const AES_ALGORITHM = getEnvironmentVariable("AES_ALGORITHM");
export const AES_KEY = getEnvironmentVariable("AES_KEY");
export const MONGO_URI = getEnvironmentVariable("MONGO_URI");
export const PORT = getEnvironmentVariableNumber("PORT", 3000);
export const JWT_SECRET = getEnvironmentVariable("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnvironmentVariable("JWT_REFRESH_SECRET");
export const COOKIE_NAME = getEnvironmentVariable("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentVariable("COOKIE_SECRET");
export const NODE_ENV = getEnvironmentVariable("NODE_ENV", "development");