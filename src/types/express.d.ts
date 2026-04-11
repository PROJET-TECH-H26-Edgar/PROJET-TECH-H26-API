import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        idUser: number;
        idRole: number;
        isAdmin: boolean;
      };
    }
  }
}
