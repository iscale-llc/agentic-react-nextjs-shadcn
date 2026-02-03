"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createUserSchema, updateUserSchema } from "@/lib/validations/user"

export type ActionState = {
  error: string | null
  success: boolean
} | null

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    status: formData.get("status") as string || "active",
  }

  const parsed = createUserSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  try {
    await db.insert(users).values(parsed.data)
    revalidatePath("/dashboard/users")
    return { error: null, success: true }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "Email already exists", success: false }
    }
    return { error: "Failed to create user", success: false }
  }
}

export async function updateUser(id: string, data: Record<string, unknown>): Promise<ActionState> {
  const parsed = updateUserSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  try {
    await db.update(users).set({ ...parsed.data, updatedAt: new Date() }).where(eq(users.id, id))
    revalidatePath("/dashboard/users")
    return { error: null, success: true }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "Email already exists", success: false }
    }
    return { error: "Failed to update user", success: false }
  }
}

export async function deleteUser(formData: FormData): Promise<ActionState> {
  const id = formData.get("id") as string
  if (!id) return { error: "User ID required", success: false }

  try {
    await db.delete(users).where(eq(users.id, id))
    revalidatePath("/dashboard/users")
    return { error: null, success: true }
  } catch {
    return { error: "Failed to delete user", success: false }
  }
}
