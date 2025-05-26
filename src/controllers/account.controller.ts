import { NextFunction, Response } from "express";
import { AuthRequest } from "../common/interfaces";
import { AccountService } from "../services";
import { EncryptedAccountData } from "../common/types";
import { ClientError } from "../utils";

const { getAllAccounts, decryptAccountDetails } = new AccountService();
export default class AccountController {
	/**
	 * Handles Fetching All exsiting Accounts
	 * @desc    Get all accounts
	 * @route   GET /api/v1/accounts
	 * @access  Public
	 * @returns Promise<void> - Returns a success response when Accounts are retrieved
	 */
	async getAllUsersAccount(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const limit = parseInt(req.query.limit as string) || 10;
			const page = parseInt(req.query.page as string) || 1
			const usersAccount = await getAllAccounts(page, limit);

			res.status(200).json({
				...usersAccount,
			});
		} catch (error) {
			if (error instanceof ClientError) {
				return next(new ClientError(error.message, error.statusCode));
			}
			return next(new ClientError());
		}
	}

	/**
	 * Handles decryption of sensitive data
	 * @desc    Decrypt encrypted data
	 * @route   POST /api/v1/decrypt
	 * @access  Public
	 * @returns Promise<void> - Returns a success response when Encrypted data is decrypted successfully
	 */
	async getDecryptedData(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			const { phoneNumber, dateOfBirth, cardNumber, cvv, expiryDate } =
				req.body;
			const encryptedData: Partial<EncryptedAccountData> = {
				phoneNumber: phoneNumber as string,
				dateOfBirth: dateOfBirth as string,
				cardNumber: cardNumber as string,
				cvv: cvv as string,
				expiryDate: expiryDate as string,
			};
			const data = await decryptAccountDetails(encryptedData);

			if (Object.keys(data.errors).length > 0) {
				return next(
					res.status(400).json({
						success: false,
						errors: data.errors,
					})
				);
			}

			res.status(200).send({
				success: true,
				message: "Data decrypted Successfully",
				data: data.decryptedData,
			});
		} catch (error) {
			if (error instanceof ClientError) {
				return next(new ClientError(error.message, error.statusCode));
			}
			return next(new ClientError());
		}
	}
}
