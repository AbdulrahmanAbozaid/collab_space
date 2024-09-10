import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import API from "../routes/index.routes";
import GlobeErrorHandler from "../middlewares/errorHandler";
import AppError from "../utils/appError";

// Initialize express application
dotenv.config();
const app: Application = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "30mb" }));

// Basic security and logging
app.use(
  cors({
    allowedHeaders: "*",
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(API);

app.use(GlobeErrorHandler);
// Error handling for unknown routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Export server for deployment
export default app;
