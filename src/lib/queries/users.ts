import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, ilike, or, desc, asc, count, and, type SQL } from "drizzle-orm"

export type UsersQueryParams = {
  search?: string | null
  role?: string | null
  status?: string | null
  sort?: string | null
  order?: "asc" | "desc" | null
  limit?: number
  offset?: number
}

export async function getUsers(params: UsersQueryParams = {}) {
  const { search, role, status, sort = "createdAt", order = "desc", limit = 20, offset = 0 } = params

  const conditions: SQL[] = []

  if (search) {
    conditions.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))!)
  }
  if (role && role !== "all") {
    conditions.push(eq(users.role, role as typeof users.role.enumValues[number]))
  }
  if (status && status !== "all") {
    conditions.push(eq(users.status, status as typeof users.status.enumValues[number]))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const sortColumn = sort === "name" ? users.name : sort === "email" ? users.email : sort === "role" ? users.role : sort === "status" ? users.status : users.createdAt
  const orderFn = order === "asc" ? asc : desc

  const [data, [{ total }]] = await Promise.all([
    db.select().from(users).where(where).orderBy(orderFn(sortColumn)).limit(limit).offset(offset),
    db.select({ total: count() }).from(users).where(where),
  ])

  return {
    data,
    pagination: { total, limit, offset, hasMore: offset + limit < total },
  }
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user ?? null
}
