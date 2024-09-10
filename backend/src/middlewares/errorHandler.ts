import { NextFunction, Response, Request } from "express";
import AppError from "../utils/appError";

const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack);

  if (process.env.NODE_ENV === "production") {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      name: err.name || "SERVER_FAIL",
    });
  }

  // Error Args contain accessToken and RefreshToken when fail to auth
  res.status(err.statusCode || 500).json({
    success: false,
    name: err.name || "SERVER_FAIL",
    message: err.message,
    stack: err.stack,
    status: err.statusCode || 500,
    args: err.args,
  });
};

export default errorHandler;
