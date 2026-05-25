import express from "express";
import type { Express } from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("CodeArena API Running");
});

export default app;