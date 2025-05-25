import { NextFunction, Response } from "express";
import { AuthRequest } from "../common/interfaces";
import { AccountService } from "../services";
import { EncryptedAccountData } from "../common/types";

const { getAllAccounts, decryptAccountDetails } = new AccountService();
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

	async getDecryptedData(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			const { phoneNumber, dateOfBirth, cardNumber, cvv, expiryDate } = req.body;
			const encryptedData: Partial<EncryptedAccountData> = {
				phoneNumber: phoneNumber as string,
				dateOfBirth: dateOfBirth as string,
				cardNumber: cardNumber as string,
				cvv: cvv as string,
				expiryDate: expiryDate as string,
			};
			const data = await decryptAccountDetails(encryptedData);

            if (Object.keys(data.errors).length > 0){
                return next(res.status(400).json({
                    success:false,
                    errors: data.errors
                }));
            }

            res.status(200).send({
                success: true,
                message: "Data decrypted Successfully",
                data: data.decryptedData,
            })

		} catch (error) {
            next(error);
        }
	}
}
