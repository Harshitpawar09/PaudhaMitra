import { Router, type IRouter, type Request, type Response } from "express";
import http from "http";

const router: IRouter = Router();

const ML_PORT = process.env.ML_PORT || "5001";

function proxyToML(req: Request, res: Response, targetPath: string) {
  const options = {
    hostname: "127.0.0.1",
    port: parseInt(ML_PORT),
    path: targetPath,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode || 500);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("ML proxy error:", err.message);
    res.status(503).json({
      error: "ML service unavailable. The model may be loading.",
    });
  });

  if (req.method !== "GET" && req.body) {
    const body = JSON.stringify(req.body);
    proxyReq.setHeader("Content-Length", Buffer.byteLength(body));
    proxyReq.write(body);
  }

  proxyReq.end();
}

router.post("/predict", (req, res) => {
  proxyToML(req, res, "/api/predict");
});

router.get("/healthz", (req, res) => {
  proxyToML(req, res, "/api/healthz");
});

export default router;
