import { Document } from "mongoose";
import { Card } from "../types";

export interface IAccount extends Document {
	accountId: string;
	firstName: string;
	surname: string;
	accountNumber: string;
	phoneNumber: string;
	dateOfBirth: string;
	card: Card;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}
