import { model, Schema } from "mongoose";
import { IAccount } from "../common/interfaces";
import { generateDBUniqueKeyId, generateUniqueId } from "../utils";
import CryptoService from "../services/crypto.services";
import { ICipherAccount } from "../common/types";

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
		},
		dateOfBirth: {
			type: String,
			required: true,
			set: encryptData,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		password: { type: String, required: [true, "password is required"] },
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: function (doc, ret) {
				const data = {
					accountId: ret.accountId,
					fullName: ret.fullName,
					accountNumber: ret.accountNumber,
					phoneNumber: ret.phoneNumber,
					dateOfBirth: ret.dateOfBirth,
					email: ret.email,
					virtualCard: ret.VirtualCard,
					decrypted: ret.decrypted,
					createdAt: ret.createdAt,
					updatedAt: ret.updatedAt,
				};

				return data;
			},
		},
		toObject: {
			virtuals: true,
			transform: function (doc, ret) {
				const data = {
					accountId: ret.accountId,
					fullName: ret.fullName,
					accountNumber: ret.accountNumber,
					phoneNumber: ret.phoneNumber,
					dateOfBirth: ret.dateOfBirth,
					email: ret.email,
					virtualCard: ret.VirtualCard,
					decrypted: ret.decrypted,
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

AccountSchema.virtual("fullName").get(function(){
	return `${this.firstName} ${this.surname}`
})

AccountSchema.virtual("decrypted").get(function () {
	const virtualCard = this.get("VirtualCard");
	let card;
	if (virtualCard){
		card = {
			cardId: virtualCard?.cardId,
			cardNumber: decryptData(virtualCard.cardNumber),
			cvv: decryptData(virtualCard.cvv),
			expiryDate: decryptData(virtualCard.expiryDate),
			isActive: virtualCard.isActive,
		}
	}
	const data: ICipherAccount = {
		fullName: this.get("fullName"),
		accountNumber: this.accountNumber,
		phoneNumber: decryptData(this.phoneNumber),
		dateOfBirth: decryptData(this.dateOfBirth),
		email: this.email,
		virtualCard: card
	};
	return data;
});

const AccountModel = model<IAccount>("Accounts", AccountSchema);

export default AccountModel;
