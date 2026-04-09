import { db } from "../db/connection";
import { borrow, keys, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { Key } from "../types/types.types";

export class KeyRepository {
  async findAll(): Promise<Key[]> {
    const result = await db.select().from(keys);
    return result as Key[];
  }

  async findById(id: number): Promise<Key | null> {
    const result = await db.select().from(keys).where(eq(keys.idKey, id));
    return (result[0] as Key) ?? null;
  }
  async create(data: {
    name: string;
    idRole: number;
    rfidUid: string;
  }): Promise<Key> {
    const result = await db.insert(keys).values({
      name: data.name,
      idRole: data.idRole,
      rfidUid: data.rfidUid,
      createAt: new Date(),
      status: "Libérer",
    });

    const newKey = await this.findById(result[0].insertId);
    return newKey!;
  }
  async updateStatus(id: number, status: Key["status"]): Promise<void> {
    await db.update(keys).set({ status }).where(eq(keys.idKey, id));
  }
}
