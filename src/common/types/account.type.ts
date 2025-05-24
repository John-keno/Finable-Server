
export interface ICipherAccount {
	fullName: string;
	accountNumber: string;
	phoneNumber: string;
	dateOfBirth: string;
	email: string;
	virtualCard: {
		cardId: string;
		cardNumber: string;
		cvv: string;
		expiryDate: string;
		isActive: boolean;
	} | undefined;
}
