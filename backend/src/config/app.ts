import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import API from "../routes/index.routes";
import GlobeErrorHandler from "../middlewares/errorHandler";
import AppError from "../utils/appError";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";
import { ExpressPeerServer } from "peer";
import setupSocketIO from "./socket";

// Initialize environment variables
dotenv.config();

// Create express application and HTTP server
const app: Application = express();
const server: HTTPServer = createServer(app);

// Initialize Socket.IO server with CORS settings
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
  path: "/socket.io",
});

// Set up the Socket.IO logic
setupSocketIO(io);

// Initialize PeerJS server and attach to express
const peerServer = ExpressPeerServer(server, {
  // @ts-ignore
  debug: true,
});

// Mount PeerJS on /peerjs
app.use("/peerjs", peerServer);

// PeerJS event listeners
peerServer.on("connection", (client) => {
  console.log(
    "PeerJS connection established with",
    (client as any).id || client
  );
});

peerServer.on("error", (error: Error) => {
  console.error("PeerJS Server Error:", error);
});

// Middleware setup
app.use(
  cors({
    allowedHeaders: "*",
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "30mb" }));
app.use(helmet());
app.use(morgan("dev"));

// Rate limiter
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// API routes
app.use(API);

// Global error handler
app.use(GlobeErrorHandler);

// 404 route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Export server and app
export default server;
export { app };
