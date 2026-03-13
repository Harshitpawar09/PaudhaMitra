import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mlProxyRouter from "./ml-proxy";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/ml", mlProxyRouter);

export default router;
