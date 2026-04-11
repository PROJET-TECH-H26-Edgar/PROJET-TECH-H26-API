import { db } from "../db/connection";
import { borrow, keys, users } from "../db/schema";
import { eq, sql, desc } from "drizzle-orm";
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
  async create(data: { idUser: number; idKey: number }): Promise<void> {
    await db.insert(borrow).values({
      idUser: data.idUser,
      idKey: data.idKey,
      borrowTime: new Date(),
      returnTime: new Date(),
    });
    await db
      .update(keys)
      .set({ status: "Occupée" })
      .where(eq(keys.idKey, data.idKey));
  }
  async complete(idKey: number): Promise<void> {
    const activeBorrow = await db
      .select()
      .from(borrow)
      .where(eq(borrow.idKey, idKey))
      .orderBy(desc(borrow.borrowTime))
      .limit(1);

    if (!activeBorrow[0]) return;

    await db
      .update(borrow)
      .set({ returnTime: new Date() })
      .where(eq(borrow.idHBorrow, activeBorrow[0].idHBorrow));

    await db
      .update(keys)
      .set({ status: "Libérer" })
      .where(eq(keys.idKey, idKey));
  }
}
