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
    const key = await keyRepository.create(data);
    if (!key) {
      throw new AppError("Key creation failed", {
        statusCode: 500,
        code: "CREATION_FAILED",
        details: "An error occurred while creating the key",
      });
    }
    return key;
  }
  async updateKeyStatus(id: number, status: Key["status"]): Promise<void> {
    await this.getKeyById(id);
    await keyRepository.updateStatus(id, status);
  }
}
