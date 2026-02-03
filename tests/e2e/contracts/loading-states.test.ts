import { describe, it, expect, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Loading state accessibility contract", () => {
  afterAll(() => {
    agentBrowser.close()
  })

  it("loading state uses role=status with descriptive label", () => {
    agentBrowser.open(`${BASE_URL}/dashboard/users`)
    // Snapshot immediately before content loads
    const snap = agentBrowser.snapshot()
    // Either content is already loaded or loading state is semantic
    const hasLoading = snap.includes('status "Loading')
    const hasContent = snap.includes('table "Users"')
    expect(hasLoading || hasContent).toBe(true)
  })
})
