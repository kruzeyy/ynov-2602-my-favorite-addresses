import { Router } from "express";
import usersRouter from "./controllers/Users";
import addressesRouter from "./controllers/Addresses";
import countriesRouter from "./controllers/Countries";

const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/addresses", addressesRouter);
apiRouter.use("/countries", countriesRouter);

export default apiRouter;
