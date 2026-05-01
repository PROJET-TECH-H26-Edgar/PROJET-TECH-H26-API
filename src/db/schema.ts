import {
  mysqlTable,
  varchar,
  date,
  int,
  boolean,
  timestamp,
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
export const roles = mysqlTable("Roles", {
  idRole: int("IdRole").primaryKey().autoincrement(),
  roleName: varchar("RoleName", { length: 50 }).notNull(),
});

export const keys = mysqlTable("thekeys", {
  idKey: int("IdKey").primaryKey().autoincrement(),
  name: varchar("Name", { length: 30 }).notNull(),
  idRole: int("IdRole").notNull(),
  rfidUid: varchar("RfidUid", { length: 50 }).notNull(),
  createAt: date("CreateAt").notNull(),
  status: varchar("Status", { length: 30 }).notNull().default("Libérer"),
  slot: int("slot").notNull(),
});

export const borrow = mysqlTable("Borrow", {
  idHBorrow: int("IdHBorrow").primaryKey().autoincrement(),
  idUser: int("IdUser").notNull(),
  idKey: int("IdKey").notNull(),
  borrowTime: timestamp("BorrowTime").notNull(),
  returnTime: timestamp("ReturnTime").notNull(),
});
