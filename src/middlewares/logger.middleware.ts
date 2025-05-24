import { Request, Response, NextFunction } from "express";
import { loggerUtil } from "../utils";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const reqStartTime = Date.now();

	res.on("finish", () => {
		const reqDuration = Date.now() - reqStartTime;
		const logLevel =
			res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
		const logSign = res.statusCode >= 500 ? "❌" : res.statusCode >= 400 ? "⚠️" : "✅";
		loggerUtil.log(
			logLevel,
			`METHOD: ${req.method} | URL: ${req.url} | STATUS: ${res.statusCode} ${logSign}  | DURATION: ${reqDuration}ms | IP: ${req.ip} | USER-AGENT: ${req.headers["user-agent"]}`
		);
	});
	next();
}