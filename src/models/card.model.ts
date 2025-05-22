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
		accountNumber: {
			type: String,
			required: [true, "Account number is required"],
			trim: true,
		},
		cardNumber: {
			type: String,
			default: () => generateUniqueId(16),
			unique: true,
			required: [true, "Card number is required"],
			set: (value: string) => encryptData(value),
		},
		expiryDate: {
			type: String,
			default: () => getExpirationDate(3),
			required: [true, "Expiry date is required"],
			set: (value: string) => encryptData(value),
		},
		cvv: {
			type: String,
			default: () => generateUniqueId(3),
			set: (value: string) => encryptData(value),
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
        virtuals:true,
		toJSON: {
			transform: function (doc, ret) {
                delete ret._id;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
				return ret;
			},
		},
        toObject: {
            transform: function (doc, ret) {
                delete ret._id;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
				return ret;
			},
        }
	}
);

// Add middleware to update isActive field before any query
CardSchema.pre(["find", "findOne"], function (next) {
	this.transform((doc) => {
		// If doc is an array, process each item i.e for find
		if (Array.isArray(doc)) {
			doc.forEach((item) => {
				console.log("item", typeof item.createdAt);
				console.log("item", item.createdAt);
				const decryptedDate = decryptData(item.expiryDate);
				const createdAt = new Date(item.createdAt.toString());
				item.isActive = !isExpired(decryptedDate, createdAt);
				console.log("item.isActive", item.isActive);
			});
		}

		// If doc is not an array, process it directly i.e for findOne
		else if (!Array.isArray(doc)) {
			console.log("not array");
			const decryptedDate = decryptData(doc.expiryDate);
			const createdAt = new Date(doc.createdAt);
			doc.isActive = !isExpired(decryptedDate, createdAt);
			console.log("item.isActive", doc.isActive);
		}
		return doc;
	});
	next();
});

const CardModel = model<ICard>("Cards", CardSchema);
export default CardModel;
