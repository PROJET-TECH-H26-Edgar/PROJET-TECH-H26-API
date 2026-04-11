import { AppError } from "../errors/AppError";
import { BorrowRepository } from "../repositories/borrow.repository";
import { KeyRepository } from "../repositories/key.repository";
import { Borrow } from "../types/types.types";

const keyRepository = new KeyRepository();
const borrowRepository = new BorrowRepository();

export class BorrowService {
  async getAllBorrows(): Promise<Borrow[]> {
    return borrowRepository.findAll();
  }
  async createBorrow(idUser: number, idKey: number): Promise<void> {
    const key = await keyRepository.findById(idKey);
    if (!key)
      throw new AppError("Clé introuvable", {
        statusCode: 404,
        code: "NOT_FOUND",
        details: "",
      });
    if (key.status === "Occupée")
      throw new AppError("Clé déjà empruntée", {
        statusCode: 400,
        code: "KEY_UNAVAILABLE",
        details: "",
      });
    await borrowRepository.create({ idUser, idKey });
  }
  async completeBorrow(idKey: number): Promise<void> {
    await borrowRepository.complete(idKey);
  }
}
