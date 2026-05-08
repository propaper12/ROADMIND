import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AGENT_REGISTRY, getAgentById } from "../services/agentRegistryService.js";

export const agentRouter = Router();

agentRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(AGENT_REGISTRY);
  }),
);

agentRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const agent = getAgentById(req.params.id);
    if (!agent) {
      res.status(404).json({ error: "Agent not found", code: "NOT_FOUND" });
      return;
    }
    res.json(agent);
  }),
);
