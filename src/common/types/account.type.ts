import { Card } from "./card.type";

export type Account = {
    firstName: string;
    surname: string;
    accountNumber: number;
    card:Card
    phoneNumber: number;
    dateOfBirth: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};