import { Router } from "express";
import postRoutes from "./posts";

const rootRouter = Router();

rootRouter.use("/posts", postRoutes)

export default rootRouter;