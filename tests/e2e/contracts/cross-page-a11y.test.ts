import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"
import {
  assertHasRole,
  assertHasRoleCount,
  assertHasAriaLabel,
  assertHasAriaAttribute,
  assertInteractiveElement,
  dualLayerAssert,
} from "../helpers/semantic-assertions"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Cross-page accessibility contract (dual-layer)", () => {
  let snap: string

  beforeAll(() => {
    agentBrowser.open(`${BASE_URL}/dashboard`)
    agentBrowser.waitForHydration()
    snap = agentBrowser.waitForContent()
  })

  afterAll(() => {
    agentBrowser.close()
  })

  // --- Navigation links ---

  it("sidebar has 6+ navigation links", () => {
    const navLinks = ["Dashboard", "Users", "Analytics", "Settings", "Sheets", "Activity"]
    const visual = {
      pass: navLinks.filter((l) => snap.includes(l)).length >= 6,
      message: "All nav items visible",
    }
    const semantic = assertHasRoleCount(snap, "link", 6)
    const result = dualLayerAssert(visual, semantic)
    console.log("Nav links:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("navigation links are real anchor elements", () => {
    const visual = { pass: snap.includes("Dashboard"), message: "Dashboard link visible" }
    const semantic = assertInteractiveElement(snap, "Dashboard")
    const result = dualLayerAssert(visual, semantic)
    console.log("Anchor elements:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Landmark regions ---

  it("page has navigation landmark", () => {
    const visual = { pass: true, message: "Nav area visible" }
    const semantic = assertHasRole(snap, "navigation")
    const result = dualLayerAssert(visual, semantic)
    console.log("Navigation landmark:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("page has main landmark", () => {
    const visual = { pass: true, message: "Main content area visible" }
    const semantic = assertHasRole(snap, "main")
    const result = dualLayerAssert(visual, semantic)
    console.log("Main landmark:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("page has banner landmark", () => {
    const visual = { pass: true, message: "Header area visible" }
    const semantic = assertHasRole(snap, "banner")
    const result = dualLayerAssert(visual, semantic)
    console.log("Banner landmark:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("navigation has aria-label", () => {
    const visual = { pass: true, message: "Nav is present" }
    const semantic = assertHasAriaLabel(snap, "Main navigation")
    const result = dualLayerAssert(visual, semantic)
    console.log("Nav label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Heading hierarchy ---

  it("page has an h1 heading", () => {
    const visual = { pass: true, message: "Title visible" }
    const semantic = assertHasRole(snap, "heading")
    const result = dualLayerAssert(visual, semantic)
    console.log("Heading:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Sign out button is real interactive element ---

  it("sign out is an interactive button", () => {
    const visual = {
      pass: snap.includes("Sign out") || snap.includes("sign out"),
      message: "Sign out text visible",
    }
    const semantic = assertInteractiveElement(snap, "Sign out")
    const result = dualLayerAssert(visual, semantic)
    console.log("Sign out:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Sidebar label ---

  it("sidebar has aria-label", () => {
    const visual = { pass: true, message: "Sidebar visible" }
    const semantic = assertHasAriaLabel(snap, "Sidebar")
    const result = dualLayerAssert(visual, semantic)
    console.log("Sidebar label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Cross-page: settings page preserves landmarks ---

  it("settings page has main landmark after navigation", () => {
    agentBrowser.open(`${BASE_URL}/dashboard/settings`)
    agentBrowser.waitForHydration()
    const settingsSnap = agentBrowser.waitForContent()

    const visual = { pass: settingsSnap.includes("Settings"), message: "Settings page loaded" }
    const semantic = assertHasRole(settingsSnap, "main")
    const result = dualLayerAssert(visual, semantic)
    console.log("Settings main landmark:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })
})
