import { Request, Response, NextFunction } from "express";
import { BorrowService } from "../services/borrow.service";

const borrowService = new BorrowService();

export class BorrowController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrows = await borrowService.getAllBorrows();
      res.status(200).json(borrows);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idKey } = req.body;
      const idUser = req.user!.idUser;
      await borrowService.createBorrow(idUser, idKey);
      res.status(201).json({ message: "Emprunt créé" });
    } catch (error) {
      next(error);
    }
  };
  complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idKey = parseInt(req.params.idKey as string);
      await borrowService.completeBorrow(idKey);
      res.status(200).json({ message: "Emprunt complété" });
    } catch (error) {
      next(error);
    }
  };
}
