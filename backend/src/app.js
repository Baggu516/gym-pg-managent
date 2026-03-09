const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const clientRoutes = require("./routes/clientRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "product-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/clients", clientRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((entry) => entry.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
