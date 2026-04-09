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
}
