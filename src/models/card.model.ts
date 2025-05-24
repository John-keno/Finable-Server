import { model, Schema } from "mongoose";
import {
	generateDBUniqueKeyId,
	generateUniqueId,
	getExpirationDate,
} from "../utils";
import CryptoService from "../services/crypto.services";
import { ICard } from "../common/interfaces/card.interface";
import { isExpired } from "../utils/dataGen.util";

const { encryptData, decryptData } = new CryptoService();

const CardSchema = new Schema<ICard>(
	{
		cardId: {
			type: String,
			default: generateDBUniqueKeyId(), // Make it a function to ensure unique IDs
			unique: true,
		},
		cardNumber: {
			type: String,
			default: () => generateUniqueId(16),
			unique: true,
			required: [true, "Card number is required"],
			set: encryptData,
			get: decryptData,
		},
		expiryDate: {
			type: String,
			default: () => getExpirationDate(3),
			required: [true, "Expiry date is required"],
			set: encryptData,
			get: decryptData,
		},
		cvv: {
			type: String,
			default: () => generateUniqueId(3),
			set: encryptData,
			get: decryptData,
			required: [true, "CVV is required"],
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
			required: true,
		},
	},
	{
		timestamps: true,
		virtuals: true,
		toJSON: {
			transform: function (doc, ret) {
				const data = {
					cardId: ret.cardId,
					cardNumber: ret.cardNumber,
					cvv: ret.cvv,
					expiryDate: ret.expiryDate,
					isActive: ret.isActive,
				};

				return data;
			},
		},
		toObject: {
			transform: function (doc, ret) {
				const data = {
					cardId: ret.cardId,
					cardNumber: ret.cardNumber,
					cvv: ret.cvv,
					expiryDate: ret.expiryDate,
					isActive: ret.isActive,
					createdAt: ret.createdAt,
					updatedAt: ret.updatedAt,
				};

				return data;
			},
		},
	}
);

// Add middleware to update isActive field before any query
CardSchema.pre(["find", "findOne"], function (next) {
	this.transform((doc: ICard) => {
		// If doc is an array, process each item i.e for find
		if (Array.isArray(doc)) {
			doc.forEach((item) => {
				const decryptedDate = item.expiryDate;
				const createdAt = new Date(item.createdAt.toString());
				item.isActive = !isExpired(decryptedDate, createdAt);
			});
		}

		// If doc is not an array, process it directly i.e for findOne
		else if (!Array.isArray(doc)) {
			const decryptedDate = decryptData(doc.expiryDate);
			const createdAt = new Date(doc.createdAt);
			doc.isActive = !isExpired(decryptedDate, createdAt);
		}
		return doc;
	});
	next();
});

const CardModel = model<ICard>("Cards", CardSchema);
export default CardModel;
