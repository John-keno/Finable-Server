import { Document } from "mongoose";

export interface ICard extends Document {
    cardId: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    isActive:boolean;
    createdAt: Date;
    updatedAt: Date;
}