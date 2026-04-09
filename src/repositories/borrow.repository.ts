import { db } from "../db/connection";
import { borrow, keys, users } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { Borrow } from "../types/types.types";

export class BorrowRepository {
  async findAll(): Promise<Borrow[]> {
    const result = await db
      .select({
        idHBorrow: borrow.idHBorrow,
        keyName: keys.name,
        userName: sql<string>`CONCAT(${users.lastName}, ' ', ${users.name})`, //Aide de chat GPT
        borrowTime: borrow.borrowTime,
        returnTime: borrow.returnTime,
      })
      .from(borrow)
      .innerJoin(keys, eq(borrow.idKey, keys.idKey))
      .innerJoin(users, eq(borrow.idUser, users.idUser));

    return result as Borrow[];
  }
}
