import { Router } from "express";
import { AccountController } from "../controllers";
import { RequestValidator } from "../middlewares/validators.middleware";
import { CipherSchema } from "../validations/account.schemas";

const { getAllUsersAccount, getDecryptedData } = new AccountController();

export default function () {
	const router: Router = Router();
	router.get("/api/v1/accounts", getAllUsersAccount);
	router.post("/api/v1/decrypt",RequestValidator(CipherSchema), getDecryptedData );
	return router;
}
