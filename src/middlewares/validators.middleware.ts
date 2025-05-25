import { Response, NextFunction, RequestHandler } from "express";
import { ZodError, ZodType } from "zod";
import { AuthRequest } from "../common/interfaces";
import { ClientError } from "../utils";

export const RequestValidator =
	(schema: ZodType<any>): RequestHandler =>
	(req: AuthRequest, res: Response, next: NextFunction): void => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				const errors = err.errors.map((err) => ({
					field: err.path.join("."),
					message: err.message,
				}));
				res.status(400).send({
					success: false,
					errors,
				});
			}
			next(new ClientError());
		}
	};
