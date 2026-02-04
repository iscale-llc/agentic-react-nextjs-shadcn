import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"
import {
  assertHasRole,
  assertHasAriaLabel,
  assertHasAriaAttribute,
  assertInteractiveElement,
  assertKeyboardFocusable,
  dualLayerAssert,
} from "../helpers/semantic-assertions"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Settings accessibility contract (dual-layer)", () => {
  let snap: string

  beforeAll(() => {
    agentBrowser.open(`${BASE_URL}/dashboard/settings`)
    agentBrowser.waitForHydration()
    snap = agentBrowser.waitForContent()
  })

  afterAll(() => {
    agentBrowser.close()
  })

  // --- Save button: div-as-button trap ---

  it("Save Changes is a real button element", () => {
    const visual = {
      pass: snap.includes("Save Changes"),
      message: "Save Changes text visible",
    }
    const semantic = assertInteractiveElement(snap, "Save Changes")
    const result = dualLayerAssert(visual, semantic)
    console.log("Save button:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Notification toggles: div-based toggle trap ---

  it("notification toggles are switch role elements", () => {
    const visual = {
      pass: snap.includes("Email") || snap.includes("Push") || snap.includes("Notifications"),
      message: "Toggle labels visible",
    }
    const semantic = assertHasRole(snap, "switch")
    const result = dualLayerAssert(visual, semantic)
    console.log("Toggle switches:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("toggles have aria-checked state", () => {
    const visual = { pass: true, message: "Toggle visual state shown" }
    const semantic = assertHasAriaAttribute(snap, "checked")
    const result = dualLayerAssert(visual, semantic)
    console.log("aria-checked:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Profile form: unlabeled inputs trap ---

  it("profile name input has a label", () => {
    const visual = {
      pass: snap.includes("Name") || snap.includes("name"),
      message: "Name field visible",
    }
    // With proper labels, agent-browser shows textbox "Name" or label association
    const semantic = assertInteractiveElement(snap, "Name")
    const result = dualLayerAssert(visual, semantic)
    console.log("Name label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("profile email input has a label", () => {
    const visual = {
      pass: snap.includes("Email") || snap.includes("email"),
      message: "Email field visible",
    }
    const semantic = assertInteractiveElement(snap, "Email")
    const result = dualLayerAssert(visual, semantic)
    console.log("Email label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("profile bio input has a label", () => {
    const visual = {
      pass: snap.includes("Bio") || snap.includes("bio") || snap.includes("about"),
      message: "Bio field visible",
    }
    const semantic = assertInteractiveElement(snap, "Bio")
    const result = dualLayerAssert(visual, semantic)
    console.log("Bio label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Theme selector: color-only swatches trap ---

  it("theme swatches are interactive radio elements", () => {
    const visual = {
      pass: snap.includes("Theme"),
      message: "Theme section visible",
    }
    const semantic = assertHasRole(snap, "radio")
    const result = dualLayerAssert(visual, semantic)
    console.log("Theme radios:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("theme has radiogroup container", () => {
    const visual = { pass: true, message: "Theme swatches visible" }
    const semantic = assertHasRole(snap, "radiogroup")
    const result = dualLayerAssert(visual, semantic)
    console.log("Radiogroup:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Priority reorder: mouse-only drag trap ---

  it("priority list has keyboard-accessible reorder buttons", () => {
    const visual = {
      pass: snap.includes("Priority") || snap.includes("priority"),
      message: "Priority list visible",
    }
    // With fix, there are "Move X up" / "Move X down" buttons
    const semantic = assertInteractiveElement(snap, "Move")
    const result = dualLayerAssert(visual, semantic)
    console.log("Reorder buttons:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Avatar upload: div-as-button trap ---

  it("avatar upload is an interactive element", () => {
    const visual = {
      pass: snap.includes("Avatar") || snap.includes("JD"),
      message: "Avatar section visible",
    }
    const semantic = assertInteractiveElement(snap, "avatar")
    const result = dualLayerAssert(visual, semantic)
    console.log("Avatar upload:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("avatar upload trigger is keyboard-focusable", () => {
    const visual = { pass: true, message: "Upload area visible" }
    const semantic = assertKeyboardFocusable(snap, "avatar")
    const result = dualLayerAssert(visual, semantic)
    console.log("Avatar focusable:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })
})
