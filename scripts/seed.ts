import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { users } from "../src/db/schema"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const testUsers = [
  { name: "Admin User", email: "admin@test.com", role: "admin" as const, status: "active" as const },
  { name: "Jane Manager", email: "jane@test.com", role: "manager" as const, status: "active" as const },
  { name: "Bob Member", email: "bob@test.com", role: "member" as const, status: "active" as const },
  { name: "Alice Viewer", email: "alice@test.com", role: "viewer" as const, status: "active" as const },
  { name: "Charlie Pending", email: "charlie@test.com", role: "member" as const, status: "pending" as const },
  { name: "Diana Inactive", email: "diana@test.com", role: "member" as const, status: "inactive" as const },
  { name: "Eve Suspended", email: "eve@test.com", role: "member" as const, status: "suspended" as const },
  { name: "Frank Admin", email: "frank@test.com", role: "admin" as const, status: "active" as const },
  { name: "Grace Manager", email: "grace@test.com", role: "manager" as const, status: "active" as const },
  { name: "Hank Member", email: "hank@test.com", role: "member" as const, status: "active" as const },
]

async function seed() {
  console.log("Seeding database...")
  await db.delete(users)
  await db.insert(users).values(testUsers)
  console.log(`Seeded ${testUsers.length} users`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
