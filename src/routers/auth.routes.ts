import { verifyAccess } from './../middlewares/authenticator.middleware';
import { Router } from "express";
import { AuthController } from "../controllers";
import { RequestValidator } from "../middlewares/validators.middleware";
import { LoginSchema, RegistrationSchema } from "../validations/auth.schemas";

const {
	registerUser,
	loginUser,
	getUserAccount,
	refreshAccessToken,
	logoutUser,
} = new AuthController();

export default function (router: Router) {
	// Auth Routes: Unauthenticated
	router.post("/auth/register", RequestValidator(RegistrationSchema), registerUser);
	router.post("/auth/login", RequestValidator(LoginSchema),loginUser);

	// Auth Routes: Authenticated
	router.post("/auth/logout", verifyAccess, logoutUser);
	router.get("/auth/me", verifyAccess, getUserAccount);
	router.get("/auth/refresh", refreshAccessToken);

	return router;
}
