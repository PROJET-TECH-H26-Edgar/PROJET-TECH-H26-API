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
  async findFreeSlot(): Promise<number | null> {
    const result = await db.select().from(keys);

    const usedSlots = result.map((k) => k.slot);

    for (let i = 1; i <= 4; i++) {
      if (!usedSlots.includes(i)) return i;
    }

    return null;
  }
  async create(data: {
    name: string;
    idRole: number;
    rfidUid: string;
    slot: number;
  }): Promise<Key> {
    const slot = await this.findFreeSlot();

    if (!slot) {
      throw new Error("Aucun slot disponible");
    }

    await db.insert(keys).values({
      name: data.name,
      idRole: data.idRole,
      rfidUid: data.rfidUid,
      slot: slot,
      createAt: new Date(),
      status: "Libérer",
    });

    const newKey = await this.findByRfid(data.rfidUid);
    return newKey!;
  }
  async updateStatus(id: number, status: Key["status"]): Promise<void> {
    await db.update(keys).set({ status }).where(eq(keys.idKey, id));
  }
  async findByRfid(rfidUid: string): Promise<Key | null> {
    const result = await db
      .select()
      .from(keys)
      .where(eq(keys.rfidUid, rfidUid));
    return (result[0] as Key) ?? null;
  }
  async delete(id: number): Promise<void> {
    await db.delete(keys).where(eq(keys.idKey, id));
  }
}
