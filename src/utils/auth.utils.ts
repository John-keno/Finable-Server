import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config";

export function generateAccessToken(userId: string): string {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string) {
	return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "1d" });
}

export function verifyAccessToken(token: string): string | jwt.JwtPayload {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw new Error("Invalid access token");
	}
}

export function verifyRefreshToken(token: string): string | jwt.JwtPayload {
	try {
		return jwt.verify(token, JWT_REFRESH_SECRET);
	} catch (error) {
		throw new Error("Invalid refresh token");
	}
}

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 14;
	return await bcrypt.hash(password, saltRounds);
}
export async function checkPassword(
	password: string,
	hash: string
): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}
