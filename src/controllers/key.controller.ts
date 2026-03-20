import { Request, Response, NextFunction } from "express";
import { KeyService } from "../services/key.service";

const keyService = new KeyService();

export class KeyController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keys = await keyService.getAllKeys();
      res.status(200).json(keys);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const key = await keyService.getKeyById(id);
      res.status(200).json(key);
    } catch (error) {
      next(error);
    }
  };
}
