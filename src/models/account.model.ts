import { model, Schema } from "mongoose";
import { IAccount } from "../common/interfaces";
import { generateDBUniqueKeyId, generateUniqueId } from "../utils";
import CryptoService from "../services/crypto.services";

const { encryptData, decryptData } = new CryptoService();

const AccountSchema = new Schema<IAccount>(
	{
		accountId: { type: String, default: generateDBUniqueKeyId(), unique: true },
		firstName: {
			type: String,
			required: [true, "firstName is required"],
			trim: true,
		},
		surname: { type: String, required: [true, "surname is required"] },
		accountNumber: {
			type: String,
			default: generateUniqueId(10),
			required: [true, "Account number is required"],
			unique: [true, "Account number must be unique"],
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
			set: encryptData,
			get: decryptData,
		},
		dateOfBirth: {
			type: String,
			required: true,
			set: encryptData,
			get: decryptData,
		},
		email: { type: String, required: [true, "Email is required"], unique: true },
		password: { type: String, required:[true, "password is required"] },
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			getters: true,
			transform: function (doc, ret) {
				const data = {
					accountId: ret.accountId,
					firstName: ret.firstName,
					surname: ret.surname,
					accountNumber: ret.accountNumber,
					phonenumber: ret.phoneNumber,
					dateOfBirth: ret.dateOfBirth,
					email: ret.email,
					virtualCard: ret.VirtualCard,
					createdAt: ret.createdAt,
					updatedAt: ret.updatedAt,
				};

				return data;
			},
		},
		toObject: {
			virtuals: true,
			getters: true,
			transform: function (doc, ret) {
				const data = {
					accountId: ret.accountId,
					firstName: ret.firstName,
					surname: ret.surname,
					accountNumber: ret.accountNumber,
					phonenumber: ret.phoneNumber,
					dateOfBirth: ret.dateOfBirth,
					email: ret.email,
					virtualCard: ret.VirtualCard,
					createdAt: ret.createdAt,
					updatedAt: ret.updatedAt,
				};

				return data;
			},
		},
	}
);

AccountSchema.virtual("VirtualCard", {
	ref: "Cards",
	localField: "accountId",
	foreignField: "cardId",
	justOne: true,
});

const AccountModel = model<IAccount>("Accounts", AccountSchema);

export default AccountModel;
