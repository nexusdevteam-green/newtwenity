import express from "express";
import cors from "cors";
import { attachUser } from "./middleware/auth.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(attachUser);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
