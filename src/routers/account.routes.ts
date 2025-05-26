import { Router } from "express";
import { AccountController } from "../controllers";
import { RequestValidator } from "../middlewares/validators.middleware";
import { CipherSchema } from "../validations/account.schemas";
import { verifyAccess } from "../middlewares";

const { getAllUsersAccount, getDecryptedData } = new AccountController();

export default function (router: Router) {
	router.get("/accounts", verifyAccess, getAllUsersAccount);
	router.post("/decrypt",verifyAccess, RequestValidator(CipherSchema), getDecryptedData );
	return router;
}
