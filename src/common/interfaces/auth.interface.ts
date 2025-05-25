import { Request } from "express";

export interface AuthRequest extends Request {
	user?: {
		accountId?: string;
	};
}
