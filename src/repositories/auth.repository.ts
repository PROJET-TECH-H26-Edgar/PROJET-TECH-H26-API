import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { User } from "../types/user.types";

export class AuthRepository {
  async findById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.idUser, id));
    return result[0] || null;
  }

  async findByMail(mail: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.mail, mail));
    return result[0] || null;
  }

  async create(user: {
    lastName: string;
    name: string;
    mail: string;
    password: string;
  }): Promise<User> {
    await db.insert(users).values({
      lastName: user.lastName,
      name: user.name,
      mail: user.mail,
      password: user.password,
      idRole: 1,
      createAt: new Date(), 
    });

    const createdUser = await this.findByMail(user.mail);
    if (!createdUser) throw new Error("User not created");
    return createdUser;
  }
}
