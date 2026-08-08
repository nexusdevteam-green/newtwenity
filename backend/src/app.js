import express from "express";
import cors from "cors";
import { attachUser } from "./middleware/auth.js";
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Sin origin = curl, health checks, apps móviles... no lo bloqueamos.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(attachUser);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
