import { Request } from "express";
//donné de par l'ia pour la lecture du token JWT, pour lire l'idUser
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
