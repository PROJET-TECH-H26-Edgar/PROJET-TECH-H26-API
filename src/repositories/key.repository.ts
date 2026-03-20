import { db } from "../db/connection";
import { borrow, keys, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { Key } from "../types/user.types";

export class KeyRepository {
  async findAll(): Promise<Key[]> {
    const allKeys = await db.select().from(keys);

    const result = await Promise.all(
      allKeys.map(async (key) => {
        const activeBorrow = await db
          .select()
          .from(borrow)
          .where(eq(borrow.idKey, key.idKey));

        const isActive = activeBorrow.some((b) => b.status === "emprunté");
        const status: Key["status"] = isActive ? "Occupée" : "Libérer"; // ← dans le map

        return {
          ...key,
          status,
        } as Key;
      }),
    );

    return result;
  }
  async findById(id: number): Promise<Key | null> {
    const result = await db.select().from(keys).where(eq(keys.idKey, id));
    if (!result[0]) return null;

    const activeBorrow = await db
      .select()
      .from(borrow)
      .where(eq(borrow.idKey, id));

    const isActive = activeBorrow.some((b) => b.status === "emprunté");
    const status: Key["status"] = isActive ? "Occupée" : "Libérer";
    return {
      ...result[0],
      status,
    } as Key;
  }
}
