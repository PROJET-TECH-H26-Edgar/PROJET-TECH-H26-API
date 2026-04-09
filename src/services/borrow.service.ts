import { BorrowRepository } from "../repositories/borrow.repository";
import { Borrow } from "../types/types.types";

const borrowRepository = new BorrowRepository();

export class BorrowService {
  async getAllBorrows(): Promise<Borrow[]> {
    return borrowRepository.findAll();
  }
}
