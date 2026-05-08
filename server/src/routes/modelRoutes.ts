import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { testProvider } from "../services/providerStatusService.js";
import { listModels } from "../services/modelCatalogService.js";

export const modelRouter = Router();

modelRouter.get(
  "/models",
  asyncHandler(async (req, res) => {
    const provider = (req.query.provider as "cloud" | "local" | "auto") ?? "auto";
    const result = await listModels(provider);
    res.json(result);
  }),
);

modelRouter.post(
  "/ollama/test",
  asyncHandler(async (req, res) => {
    const provider = (req.body.provider as "cloud" | "local" | "auto") ?? "auto";
    const model = req.body.model as string | undefined;
    const status = await testProvider(provider, model);
    res.json(status);
  }),
);
