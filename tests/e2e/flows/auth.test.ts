import { describe, it, expect, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Auth flow", () => {
  afterAll(() => {
    agentBrowser.close()
  })

  it("redirects unauthenticated users to login", () => {
    agentBrowser.open(`${BASE_URL}/dashboard`)
    agentBrowser.waitForHydration()
    const snap = agentBrowser.snapshot()
    expect(snap).toContain("Sign in")
  })

  it("login page has accessible form", () => {
    agentBrowser.open(`${BASE_URL}/login`)
    agentBrowser.waitForHydration()
    const snap = agentBrowser.snapshot()
    expect(snap).toContain("Email")
    expect(snap).toContain("Password")
    expect(snap).toContain("Sign in")
  })
})
