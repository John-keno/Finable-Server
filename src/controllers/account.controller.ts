import { Request, Response, NextFunction } from "express";
import { RegisterType } from "../common/types";
import AuthService from "../services/auth.service";
import mongoose, { ClientSession } from "mongoose";
import { AccountModel } from "../models";

const { register } = new AuthService();
export default class AccountController {
	/**
	 * Handles user registration and Account creation
	 * @desc    Register a new user
	 * @route   POST /api/v1/auth/register
	 * @access  Public
	 * @returns Promise<void> - Returns a success response when user is registered
	 */
	async registerUser(req: Request, res: Response, next: NextFunction) {
		const session: ClientSession = await AccountModel.startSession();

		try {
            console.log(session.hasEnded)
			const registeredAccount = await session.withTransaction(async () => {
				const {
					firstName,
					surname,
					dateOfBirth,
					email,
					password,
					phoneNumber,
				} = req.body;
				const userAccount: RegisterType = {
					firstName,
					surname,
					dateOfBirth,
					email,
					password,
					phoneNumber,
				};
                console.log(session.hasEnded)
				const account = await register(userAccount, session);
				session.commitTransaction();
				return account;
			});
            console.log(session.hasEnded)
			res.status(201).send({
				success: true,
				message: "Account Created Successfully",
				data: registeredAccount,
			});
		} catch (error) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}
			return next(error)
		} finally {
			await session.endSession();
		}
	}

	/**
	 * Handles user login and token generation
	 * @desc    Login a user
	 * @route   POST /api/v1/auth/login
	 * @access  Public
	 * @returns Promise<void> - Returns a success response when user is logged in
	 */
	async loginUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Handles user logout by clearing refresh token cookie
	 * @desc Logout a user
	 * @route POST /api/v1/auth/logout
	 * @access Private
	 * @returns Promise<void> - Returns a success response when user is logged out
	 * @throws forwards any errors to the Express error handler via next()
	 */
	async logoutUser(req: Request, res: Response, next: NextFunction) {
		try {
			res.clearCookie("refreshToken"); // Clear cookie
			// Logic for logging out the user
			res.status(200).send({
				success: true,
				message: "User logged out successfully",
			});
		} catch (error) {
			next(error);
		}
	}
}
