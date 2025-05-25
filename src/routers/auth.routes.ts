import { Router } from "express";
import { AuthController } from "../controllers";

const {
	registerUser,
	loginUser,
	getUserAccount,
	refreshAccessToken,
	logoutUser,
} = new AuthController();

export default function (router: Router) {
	// Auth Routes: Unauthenticated
	router.post("/api/v1/auth/register", registerUser);
	router.post("/api/v1/auth/login", loginUser);

	// Auth Routes: Authenticated
	router.post("/api/v1/auth/logout", logoutUser);
	router.get("/api/v1/auth/me", getUserAccount);
	router.get("/api/v1/auth/refresh", refreshAccessToken);

	return router;
}
