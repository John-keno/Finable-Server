import { model, Schema } from "mongoose";
import { IAccount } from "../common/interfaces";
import { generateDBUniqueKeyId, generateUniqueId } from "../utils";
import CryptoService from "../services/crypto.services";

const { encryptData } = new CryptoService();

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
		},
		dateOfBirth: { type: String, required: true, set: encryptData },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

AccountSchema.virtual("VirtualCard", {
	ref: "Cards",
	localField: "accountNumber",
	foreignField: "accountNumber",
	justOne: true,
});

const AccountModel = model<IAccount>("Accounts", AccountSchema);

export default AccountModel;
