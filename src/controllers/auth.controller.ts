import { Request, Response, NextFunction } from "express";
import { AccountResponse, RegisterType } from "../common/types";
import AuthService from "../services/auth.service";
import { ClientSession } from "mongoose";
import { AccountModel } from "../models";
import {
	ClientError,
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../utils";
import { AuthRequest, IAccount } from "../common/interfaces";
import { COOKIE_NAME, NODE_ENV } from "../config";

const { register, login, getAccount } = new AuthService();

export default class AuthController {
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
				const account = (await register(
					userAccount,
					session
				)) as AccountResponse;
				if (!account) {
					return next(
						new ClientError(
							"Unable to Create Account. Please try again or contact Administration",
							400
						)
					);
				}
				session.commitTransaction();
				return account;
			});
			res.status(201).send({
				success: true,
				message: "Account Created Successfully",
				data: registeredAccount,
			});
		} catch (error) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}
			return next(new ClientError());
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
			const user: IAccount = await login(email, password);
			
			if (!user) {
				return next(new ClientError("Invalid Email or Password", 400));
			}

			const accessToken = generateAccessToken(user.accountId);
			const refreshToken = generateRefreshToken(user.accountId);

			res.cookie(COOKIE_NAME, refreshToken, {
				signed: true,
				secure: NODE_ENV === "production",
				httpOnly: true,
				path: "/",
				sameSite: "strict",
				maxAge: 24 * 60 * 60 * 1000, // 1 day
			});

			res.status(200).send({
				success: true,
				message: "Account Login Successful",
				accessToken,
				data: user,
			});
		} catch (error) {
			next(new ClientError());
		}
	}
	/**
	 * Handles fetching of authenticated user Account
	 *
	 * @desc 	Generate new access token
	 * @route 	GET /api/v1/auth/me
	 * @access 	Private
	 * @returns Promise<void> - Returns a success response when user account is found
	 * @throws 	forwards any errors to the Express error handler via next()
	 */
	async getUserAccount(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			const { accountId } = req.user!;

			const data = (await getAccount(accountId)) as AccountResponse;
			res.status(200).send({
				success: true,
				message: "Account Fetched successfully",
				data,
			});
		} catch (error) {
			next(new ClientError());
		}
	}

	/**
	 * Handles regeneration of Access token
	 *
	 * @desc 	Generate new access token
	 * @route 	POST /api/v1/auth/refresh
	 * @access 	Public
	 * @returns	Promise<void> - Returns a success response when token is generated
	 * @throws 	forwards any errors to the Express error handler via next()
	 */
	async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.signedCookies[COOKIE_NAME];
			if (!token)
				throw new ClientError("Session expired. Please login again", 401);

			const JwtPayload = verifyRefreshToken(token) as { accountId: string };
			const accessToken = generateAccessToken(JwtPayload.accountId);

			res.status(200).send({ accessToken });
		} catch (error) {
			next(new ClientError());
		}
	}

	/**
	 * Handles user logout by clearing refresh token cookie
	 *
	 * @desc 	Logout a user
	 * @route 	POST /api/v1/auth/logout
	 * @access 	Private
	 * @returns	Promise<void> - Returns a success response when user is logged out
	 * @throws	forwards any errors to the Express error handler via next()
	 */
	async logoutUser(req: Request, res: Response, next: NextFunction) {
		try {
			res.clearCookie(COOKIE_NAME, {
				path: "/",
				httpOnly: true,
				signed: true,
				sameSite: "strict",
				secure: NODE_ENV === "production",
			}); // Clear cookie

			res.status(200).send({
				success: true,
				message: "User logged out successfully",
			});
		} catch (error) {
			next(new ClientError());
		}
	}
}
