import { Router } from "express";
import AccountController from "../controllers/account.controller";

const { getAllUsersAccount } = new AccountController();

export default function (router: Router) {
	router.get("/api/v1/accounts", getAllUsersAccount);
    return router
}
