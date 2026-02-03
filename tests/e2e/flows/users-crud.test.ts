import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Users CRUD flow", () => {
  beforeAll(() => {
    agentBrowser.open(`${BASE_URL}/dashboard/users`)
    agentBrowser.waitForHydration()
    agentBrowser.waitForContent()
  })

  afterAll(() => {
    agentBrowser.close()
  })

  it("shows users table with data", () => {
    const snap = agentBrowser.snapshot()
    expect(snap).toContain('table "Users"')
    expect(snap).toContain("admin@test.com")
  })

  it("can search users", () => {
    const snap = agentBrowser.snapshot()
    // Find search input
    expect(snap).toContain("Search users")
  })

  it("shows create user button", () => {
    const snap = agentBrowser.snapshot()
    expect(snap).toContain("Create user")
  })

  it("has filter controls", () => {
    const snap = agentBrowser.snapshot()
    expect(snap).toContain("Filter by role")
    expect(snap).toContain("Filter by status")
  })
})
