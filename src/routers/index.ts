import { Router } from "express";
import AuthRoutes from "./auth.routes";
import AccountRoutes from "./account.routes";

const router: Router = Router();

export default function (): Router {
	AuthRoutes(router);
	AccountRoutes(router);
	return router;
}
