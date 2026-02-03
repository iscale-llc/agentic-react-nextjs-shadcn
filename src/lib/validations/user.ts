import { z } from "zod/v4"

export const userRoles = ["admin", "manager", "member", "viewer"] as const
export const userStatuses = ["active", "inactive", "suspended", "pending"] as const

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.email("Invalid email"),
  role: z.enum(userRoles).default("member"),
  status: z.enum(userStatuses).default("active"),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
