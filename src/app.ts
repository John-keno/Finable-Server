import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { clientError, notFoundError, requestLogger } from "./middlewares";
import { COOKIE_SECRET } from "./config";
import AllRoutes from "./routers/index";

const app = express();

app.use(
	cors({
		credentials: true,
	})
);
// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(requestLogger);

app.use("/api/v1/", AllRoutes());
app.get("/", async (_req: Request, res: Response) => {
	res
		.status(200)
		.send("welcome to the 🌍 Finable API. A system reborn");
});

app.use(notFoundError);
app.use(clientError);

export default app;
