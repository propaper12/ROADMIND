import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    res.json({
      status: "ok",
      version: "2.0.0",
      providerMode: env.AI_PROVIDER,
      localBaseUrl: env.OLLAMA_LOCAL_BASE_URL,
      cloudBaseUrl: env.OLLAMA_CLOUD_BASE_URL,
      hasCloudKey: !!(env.OLLAMA_API_KEY && env.OLLAMA_API_KEY.includes(".")),
    });
  }),
);
