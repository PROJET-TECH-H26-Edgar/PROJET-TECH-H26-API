import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

// Code repris de l'api pirate de la session précédante

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isAppError = error instanceof AppError;

  const statusCode = isAppError ? error.statusCode : 500;
  const code = isAppError ? error.code : "INTERNAL_ERROR";
  const message = isAppError ? error.message : "Internal Server Error";
  const details = isAppError ? error.details : undefined;

  console.error(`[${code}}] ${message}`);
  if (error instanceof Error) {
    console.error(error.stack);
    if ((error as any).cause) console.error("Cause:", (error as any).cause);
  }

  const payload: any = { error: { code, message } };
  if (details) payload.error.details = details;

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    payload.error.stack = error.stack;
    if ((error as any).cause) payload.error.cause = (error as any).cause;
  }

  res.status(statusCode).json(payload);
};
