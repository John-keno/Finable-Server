import { ClientError } from "../utils";
import { Request, Response, NextFunction } from "express";

// Error handling for routes that are not found
export const notFoundError = (_req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({ success: false, message: "Not found. Invalid Url path" });
	next();
};

// Global Middleware used for Client error logs excluding internal logs during production
export function clientError(
	err: Error,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof ClientError) {
		const statusCode = err.statusCode || 500;
		const message = err.message || "Internal Server Error";
		res.status(statusCode).json({ 
            success: false,
            message, 
            ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
        });
	}
	next();
};