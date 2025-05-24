import { ClientSession } from "mongoose";
import { RegisterType } from "../common/types";
import { AccountModel, CardModel } from "../models";
import { ClientError, hashPassword } from "../utils";

export default class AuthService {
	async register(data: RegisterType, session?: ClientSession): Promise<object> {
		const existingAccount = await AccountModel.findOne({
			email: data.email,
		}).session(session ?? null);
		if (existingAccount) {
			throw new ClientError("Email already exists", 400);
		}

		const hashedPassword = await hashPassword(data.password);
		if (!hashedPassword) {
			// Hashing failed
			throw new ClientError(
				"Account creation failed with ErrorCode:PHERR002",
				500
			);
		}

		const account = new AccountModel({
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

		const card = new CardModel({
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
		return user;
	}
	async login(email: string, password: string): Promise<string> {
		return "login_token";
	}


	async getAccount(accountId?: string): Promise<object> {
		const user = await AccountModel.find({}).populate("VirtualCard").lean();

		if (!user) {
			throw new Error("Account not found");
		}

		return user;
	}
}
