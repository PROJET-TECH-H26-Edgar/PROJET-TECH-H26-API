import {
  mysqlTable,
  varchar,
  date,
  int,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("Users", {
  idUser: int("IdUser").primaryKey().autoincrement(),
  lastName: varchar("LastName", { length: 100 }).notNull(),
  name: varchar("Name", { length: 100 }).notNull(),
  mail: varchar("Mail", { length: 255 }).notNull().unique(),
  idRole: int("IdRole").notNull().default(1),
  createAt: date("CreateAt").notNull(),
  password: varchar("Password", { length: 255 }).notNull(),
});
