import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../config";
import { AuthRequest } from "../common/interfaces";
import { ClientError, verifyAccessToken, verifyRefreshToken } from "../utils";

export const verifyAccess = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): void => {
	const bearerHeader = req.headers["authorization"]?.split(" ");
	const accessToken = bearerHeader && bearerHeader[1];
    const refreshToken = req.signedCookies[COOKIE_NAME];

	if (!accessToken || !refreshToken) {
        return next(new ClientError("Unauthorized. Please login", 401));
	}
	try {
        
		const data = verifyAccessToken(accessToken) as AuthRequest["user"];
        verifyRefreshToken(refreshToken);
		req.user = data;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return next(new ClientError("Session expired. Please login again", 401));
		}
		next(new ClientError("Forbidden", 403));
	}
};
