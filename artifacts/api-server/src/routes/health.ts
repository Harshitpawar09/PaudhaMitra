import { Router, type Request, type Response } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router = Router();

router.get("/healthz", (_req: Request, res: Response) => {
  try {
    const data = HealthCheckResponse.parse({
      status: "ok"
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed"
    });
  }
});

export default router;