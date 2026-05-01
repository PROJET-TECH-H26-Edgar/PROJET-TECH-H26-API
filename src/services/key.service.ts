import { KeyRepository } from "../repositories/key.repository";
import { Key } from "../types/types.types";
import { AppError } from "../errors/AppError";

const keyRepository = new KeyRepository();

export class KeyService {
  async getAllKeys(): Promise<Key[]> {
    return keyRepository.findAll();
  }

  async getKeyById(id: number): Promise<Key> {
    const key = await keyRepository.findById(id);
    if (!key) {
      throw new AppError("Key not found", {
        statusCode: 404,
        code: "RESOURCE_NOT_FOUND",
        details: `Key with id ${id} not found`,
      });
    }
    return key;
  }
  async createKey(data: {
    name: string;
    idRole: number;
    rfidUid: string;
  }): Promise<Key> {
    const slot = await keyRepository.findFreeSlot();

    if (!slot) {
      throw new AppError("No free slot available", {
        statusCode: 409,
        code: "NO_SLOT",
        details: "All 4 slots are occupied",
      });
    }

    const key = await keyRepository.create({
      ...data,
      slot,
    });

    return key;
  }
  async updateKeyStatus(id: number, status: Key["status"]): Promise<void> {
    await this.getKeyById(id);
    await keyRepository.updateStatus(id, status);
  }
  async returnByRfid(rfidUid: string): Promise<void> {
    const key = await keyRepository.findByRfid(rfidUid);
    if (!key)
      throw new AppError("Clé introuvable", {
        statusCode: 404,
        code: "NOT_FOUND",
        details: "",
      });
    if (key.status !== "Occupée") return;
    await keyRepository.updateStatus(key.idKey, "Indisponible");
  }
  async deleteKey(id: number): Promise<void> {
    const key = await keyRepository.findById(id);

    if (!key) {
      throw new AppError("Key not found", {
        statusCode: 404,
        code: "RESOURCE_NOT_FOUND",
        details: `Key with id ${id} not found`,
      });
    }

    await keyRepository.delete(id);
  }
}
