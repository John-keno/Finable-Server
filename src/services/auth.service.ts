import { ClientSession } from "mongoose";
import { AccountResponse, RegisterType } from "../common/types";
import { AccountModel, CardModel } from "../models";
import {
	checkPassword,
	ClientError,
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
} from "../utils";
import { IAccount, ICard } from "../common/interfaces";

export default class AuthService {
	async register(data: RegisterType, session?: ClientSession): Promise<object> {
		const existingAccount = await AccountModel.findOne({
			email: data.email,
		}).session(session ?? null);
		if (existingAccount) {
			throw new ClientError("Email already exists", 400);
		}

		const hashedPassword: string = await hashPassword(data.password);
		if (!hashedPassword) {
			// Hashing failed
			throw new ClientError(
				"Account creation failed with ErrorCode:PHERR002",
				500
			);
		}

		const account: IAccount = new AccountModel({
			firstName: data.firstName,
			surname: data.surname,
			dateOfBirth: data.dateOfBirth,
			email: data.email,
			password: hashedPassword,
			phoneNumber: data.phoneNumber,
		});

		await account.save({ session });

		if (!account) {
			throw new ClientError("Account creation failed", 400);
		}

		const card: ICard = new CardModel({
			cardId: account.accountId,
		});

		card.save({ session });

		if (!card) {
			throw new ClientError("Card creation failed", 400);
		}

		const user = await AccountModel.findOne({ _id: account._id })
			.populate({
				path: "VirtualCard",
				match: { cardId: account.accountId },
			})
			.session(session ?? null);
		if (!user) {
			throw new ClientError("Account not found", 404);
		}
		console.log(user);
		return user;
	}
	async login(email: string, password: string): Promise<IAccount> {
		const user = await AccountModel.findOne({ email });
		console.log(user);
		if (!user) {
			throw new ClientError("Invalid Email and Password", 400);
		}
		const isPassword = await checkPassword(password, user.password);

		if (!isPassword) {
			throw new ClientError("Invalid Email and Password", 400);
		}

		return user;
	}

	async getAccount(accountId?: string): Promise<object> {
		const user = await AccountModel.findOne({ accountId }).populate({
			path: "VirtualCard",
			match: { cardId: accountId },
		});

		if (!user) {
			throw new Error("Account not found");
		}

		return user;
	}
}
