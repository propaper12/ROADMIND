import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  analyzeProjectController,
  deleteProjectController,
  exportJsonController,
  exportMarkdownController,
  getProjectController,
  listProjectsController,
  exportTxtController,
  exportAgentsMdController,
  exportAgentPromptController,
} from "../controllers/projectController.js";

export const projectRouter = Router();

projectRouter.post(
  "/analyze",
  asyncHandler(async (req, res) => analyzeProjectController(req, res)),
);

projectRouter.get(
  "/",
  asyncHandler(async (req, res) => listProjectsController(req, res)),
);

projectRouter.get(
  "/:id/export/json",
  asyncHandler(async (req, res) => exportJsonController(req, res)),
);

projectRouter.get(
  "/:id/export/markdown",
  asyncHandler(async (req, res) => exportMarkdownController(req, res)),
);
 
projectRouter.get(
  "/:id/export/txt",
  asyncHandler(async (req, res) => exportTxtController(req, res)),
);
 
projectRouter.get(
  "/:id/export/agents-md",
  asyncHandler(async (req, res) => exportAgentsMdController(req, res)),
);
 
projectRouter.get(
  "/:id/export/prompt/:agent",
  asyncHandler(async (req, res) => exportAgentPromptController(req, res)),
);

projectRouter.get(
  "/:id",
  asyncHandler(async (req, res) => getProjectController(req, res)),
);

projectRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => deleteProjectController(req, res)),
);
