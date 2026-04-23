import { db } from "../db/connection";
import { roles } from "../db/schema";

export class RoleRepository {
  async findAll() {
    const result = await db.select().from(roles);
    return result;
  }
}
