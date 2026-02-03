import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "member", "viewer"])
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended", "pending"])

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("member"),
  status: userStatusEnum("status").notNull().default("active"),
  avatarUrl: varchar("avatarUrl", { length: 512 }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
