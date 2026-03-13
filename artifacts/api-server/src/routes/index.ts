import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mlProxyRouter from "./ml-proxy";
import weatherRouter from "./weather";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/ml", mlProxyRouter);
router.use(weatherRouter);

export default router;
