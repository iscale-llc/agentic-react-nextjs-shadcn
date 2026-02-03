import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Table accessibility contract", () => {
  beforeAll(() => {
    agentBrowser.open(`${BASE_URL}/dashboard/users`)
    agentBrowser.waitForHydration()
  })

  afterAll(() => {
    agentBrowser.close()
  })

  it("users table has aria-label", () => {
    const snap = agentBrowser.waitForContent()
    expect(snap).toContain('table "Users"')
  })

  it("table has sortable column headers", () => {
    const snap = agentBrowser.snapshot()
    expect(snap).toContain("columnheader")
  })

  it("no orphan loading states after content loads", () => {
    const snap = agentBrowser.snapshot()
    expect(snap).not.toContain('status "Loading')
  })
})
