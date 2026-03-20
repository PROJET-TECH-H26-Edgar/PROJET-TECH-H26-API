import { KeyRepository } from "../repositories/key.repository";
import { Key } from "../types/user.types";
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
}
