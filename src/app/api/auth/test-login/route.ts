import { NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

export async function POST() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_TEST_MODE !== "true") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Test login disabled" } }, { status: 403 })
  }

  try {
    await signIn("credentials", {
      email: "admin@test.com",
      password: "test",
      redirect: false
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Test login failed" } }, { status: 401 })
  }
}
