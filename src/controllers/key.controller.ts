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

  async createKey(req: Request, res: Response): Promise<void> {
    const { name, idRole, rfidUid } = req.body;

    if (!name || !idRole || !rfidUid) {
      res.status(400).json({
        message: "Champs manquants",
        required: ["name", "idRole", "rfidUid"],
      });
      return;
    }

    const key = await keyService.createKey({
      name,
      idRole: parseInt(idRole),
      rfidUid,
    });
    res.status(201).json(key);
  }
}
