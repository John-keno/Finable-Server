import { NextFunction } from "./../node_modules/@types/express-serve-static-core/index.d";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { clientError, notFoundError, requestLogger } from "./middlewares";
import AuthService from "./services/auth.service";
import { CardModel } from "./models";
const { register, getAccount } = new AuthService();
const app = express();
app.use(
	cors({
		credentials: true,
	})
);
// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
	res
		.status(200)
		.send("welcome to the finable API a place where udorka lagacy is nore");
});

app.use(notFoundError);
app.use(clientError);

export default app;
