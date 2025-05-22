export function getExpirationDate(yearsToAdd: number = 3): string {
	const now = new Date();
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const year = (now.getFullYear() + yearsToAdd).toString().slice(-2);

	return `${month}/${year}`;
}

export function isExpired(expiryDate: string, createdAt: Date): boolean {
	const [month, year] = expiryDate.split("/").map(Number);
	const createdYear = createdAt.getFullYear() % 100;
	const createdMonth = createdAt.getMonth() + 1;
	const data = year - createdYear <= 0 && month - createdMonth <= 0;

	return data;
}
