import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { AES_ALGORITHM, AES_KEY } from "../config";

export default class CryptoService {
	encryptData(data: string): string {
		const iv = randomBytes(16); // Initialization vector for each encryption
		const aesKey = Buffer.from(AES_KEY, "hex"); // Convert hex key to Buffer
		const cipher = createCipheriv(AES_ALGORITHM, aesKey, iv);
		const encrypted = cipher
			.update(data, "utf-8", "hex")
			.concat(cipher.final("hex"))
			.concat(iv.toString("hex")); // Append IV to the encrypted data
		return encrypted;
	}

	decryptData(encryptedData: string): string {
		const iv = Buffer.from(encryptedData.slice(-32), "hex"); // Extract IV from the end of the encrypted data
		const encryptedContent = encryptedData.slice(0, -32);
		const aesKey = Buffer.from(AES_KEY, "hex"); // Convert hex key to Buffer
		const decipher = createDecipheriv(AES_ALGORITHM, aesKey, iv);
		const decrypted = decipher
			.update(encryptedContent, "hex", "utf-8")
			.concat(decipher.final("utf-8"));
		return decrypted;
	}
}
