export interface ICipherAccount {
	fullName: string;
	accountNumber: string;
	phoneNumber: string;
	dateOfBirth: string;
	email: string;
	virtualCard:
		| {
				cardId: string;
				cardNumber: string;
				cvv: string;
				expiryDate: string;
				isActive: boolean;
		  }
		| undefined;
}

export interface AccountResponse {
	accountId: string;
	encrypted: ICipherAccount;
	decrypted: ICipherAccount;
	createdAt: Date;
	updatedAt: Date;
}

export interface EncryptedAccountData {
	phoneNumber: string;
	dateOfBirth: string;
	cardNumber: string;
	cvv: string;
	expiryDate: string;
}

export interface DecryptionResult {
    success: boolean;
    data?: string;
    error?: string;
}

export interface DecryptionResponse {
    decryptedData: Partial<EncryptedAccountData>;
    errors: Record<string, string>;
}