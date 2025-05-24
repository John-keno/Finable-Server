import { Router } from "express";
import AccountController from "../controllers";


const { registerUser, logoutUser } = new AccountController(); 

export default function (router: Router) {

    // Auth Routes: Unauthenticated
    router.post("/api/v1/auth/register", registerUser);
    // router.post("/auth/login", loginUser);

    // Auth Routes: Authenticated
    router.post("/auth/logout", logoutUser);
    // router.get("/auth/me", getUserAccount);
    // router.get("/auth/refresh", refreshToken);

    return router
}

