import { Document } from "mongoose";

export interface IAccount extends Document {
	accountId: string;
	firstName: string;
	surname: string;
	accountNumber: string;
	phoneNumber: string;
	dateOfBirth: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}
