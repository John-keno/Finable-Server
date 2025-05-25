import { IAccount } from "../common/interfaces";
import { DecryptionResponse, EncryptedAccountData } from "../common/types";
import { AccountModel } from "../models";
import { paginate } from "../utils";
import CryptoService from "./crypto.services";

const { decryptData } = new CryptoService();

export default class AccountService {
	async getAllAccounts(
		pageNumber: number,
		limitNumber: number
	): Promise<{
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		data: IAccount[];
	}> {
		const accounts = await paginate(
			AccountModel,
			pageNumber,
			limitNumber,
			{},
			{
				path: "VirtualCard",
			}
		);

		return accounts;
	}

    async decryptAccountDetails(
        data: Partial<EncryptedAccountData>
    ): Promise<DecryptionResponse> {

        const decryptedData: Partial<EncryptedAccountData> = {};
        const errors: Record<string, string> = {};

        function decryptField (fieldName: keyof EncryptedAccountData, value: string): void {
        try {
            decryptedData[fieldName] = decryptData(value);
        } catch (error: any) {
            errors[fieldName] = `Failed to decrypt ${fieldName}. Data not Valid`;
        }
    };
        

            
            if (data.phoneNumber) {
                decryptField('phoneNumber', data.phoneNumber);
            }
            if (data.dateOfBirth) {
                decryptField("dateOfBirth", data.dateOfBirth);
            }
            if (data.cardNumber) {
                decryptField("cardNumber", data.cardNumber);
            }
            if (data.cvv) {
                decryptField("cvv",data.cvv);
            }
            if (data.expiryDate) {
                decryptField("expiryDate", data.expiryDate);
            }

            return {
                decryptedData,
                errors
            }
    }
}