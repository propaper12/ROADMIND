import "./config/env.js";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/healthRoutes.js";
import { projectRouter } from "./routes/projectRoutes.js";
import { modelRouter } from "./routes/modelRoutes.js";
import { optionsRouter } from "./routes/optionsRoutes.js";
import { agentRouter } from "./routes/agentRoutes.js";
import { env } from "./config/env.js";
import { isApiError } from "./utils/ApiError.js";
import { prisma } from "./config/prisma.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRouter);
app.use("/api", modelRouter);
app.use("/api", optionsRouter);
app.use("/api/agents", agentRouter);
app.use("/api/projects", projectRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (isApiError(err)) {
      res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
        details: err.details,
      });
      return;
    }

    console.error(err);
    res.status(500).json({
      error: "Internal server error.",
      code: "INTERNAL_ERROR",
    });
  },
);

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

async function shutdown(): Promise<void> {
  await prisma.$disconnect();
  server.close();
}

process.on("SIGINT", () => void shutdown().then(() => process.exit(0)));
process.on("SIGTERM", () => void shutdown().then(() => process.exit(0)));
