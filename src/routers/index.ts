import { Router } from "express";
import AuthRoutes from "./auth.routes";

const router: Router = Router();

export default function(): Router{
    AuthRoutes(router)
    return router
}