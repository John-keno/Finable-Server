import { Router } from "express";
import { AccountController } from "../controllers";


const { getAllUsersAccount, getDecryptedData } = new AccountController();

export default function (router: Router) {
	router.get("/api/v1/accounts", getAllUsersAccount);
    router.post("/api/v1/decrypt", getDecryptedData);
    return router
}
