import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../common/interfaces";
import { AccountService } from "../services";

const { getAllAccounts } = new AccountService();
export default class AccountController {
	async getAllUsersAccount(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const { limit, page } = req.query;
			const usersAccount = await getAllAccounts(1, 10);

			res.status(200).json({
				...usersAccount,
			});
		} catch (error) {
			next(error);
		}
	}
}
