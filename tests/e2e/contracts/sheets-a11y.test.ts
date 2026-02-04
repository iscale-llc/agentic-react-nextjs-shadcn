import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { agentBrowser } from "../helpers/agent-browser"
import {
  assertHasRole,
  assertHasRoleCount,
  assertHasAriaLabel,
  assertHasAriaAttribute,
  assertInteractiveElement,
  assertNoGenericOnly,
  assertKeyboardFocusable,
  dualLayerAssert,
} from "../helpers/semantic-assertions"

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000"

describe("Sheets accessibility contract (dual-layer)", () => {
  let snap: string

  beforeAll(() => {
    agentBrowser.open(`${BASE_URL}/dashboard/sheets`)
    agentBrowser.waitForHydration()
    snap = agentBrowser.waitForContent()
  })

  afterAll(() => {
    agentBrowser.close()
  })

  // --- TRAP #22: grid structure ---

  it("grid has role=grid with rows and cells", () => {
    const visual = {
      pass: snap.length > 500,
      message: snap.length > 500
        ? `Snapshot has ${snap.length} chars of content`
        : `Snapshot too short (${snap.length} chars)`,
    }
    const semantic = assertHasRole(snap, "grid")
    const result = dualLayerAssert(visual, semantic)
    console.log("Grid structure:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("grid has row roles", () => {
    const visual = { pass: snap.includes("1") && snap.includes("2"), message: "Row numbers visible" }
    const semantic = assertHasRoleCount(snap, "row", 2)
    const result = dualLayerAssert(visual, semantic)
    console.log("Row roles:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("grid has gridcell roles", () => {
    const visual = { pass: snap.includes("Engineering") || snap.includes("Category"), message: "Cell data visible" }
    const semantic = assertHasRoleCount(snap, "gridcell", 8)
    const result = dualLayerAssert(visual, semantic)
    console.log("Gridcell roles:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("column headers have columnheader role", () => {
    const headers = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const visual = {
      pass: headers.every((h) => snap.includes(h)),
      message: "Column headers A-H visible",
    }
    const semantic = assertHasRoleCount(snap, "columnheader", 8)
    const result = dualLayerAssert(visual, semantic)
    console.log("Column headers:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("row headers have rowheader role", () => {
    const visual = {
      pass: snap.includes("1") && snap.includes("10"),
      message: "Row numbers 1-10 visible",
    }
    const semantic = assertHasRoleCount(snap, "rowheader", 10)
    const result = dualLayerAssert(visual, semantic)
    console.log("Row headers:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- TRAP #24: formula bar ---

  it("formula bar input has aria-label", () => {
    const visual = { pass: snap.includes("A1") || snap.includes("textbox"), message: "Formula input visible" }
    const semantic = assertHasAriaLabel(snap, "Formula bar")
    const result = dualLayerAssert(visual, semantic)
    console.log("Formula bar:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- TRAP #26: format toolbar ---

  it("format toolbar has role=toolbar", () => {
    const visual = {
      pass: snap.includes("B") && snap.includes("I"),
      message: "Bold/Italic buttons visible",
    }
    const semantic = assertHasRole(snap, "toolbar")
    const result = dualLayerAssert(visual, semantic)
    console.log("Toolbar role:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("format toolbar uses real buttons", () => {
    const visual = { pass: snap.includes("B"), message: "Bold indicator visible" }
    const semantic = assertInteractiveElement(snap, "Bold")
    const result = dualLayerAssert(visual, semantic)
    console.log("Toolbar buttons:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("format buttons have aria-pressed", () => {
    const visual = { pass: true, message: "Visual styling present" }
    const semantic = assertHasAriaAttribute(snap, "pressed")
    const result = dualLayerAssert(visual, semantic)
    console.log("aria-pressed:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- TRAP #23: cell selection + keyboard ---

  it("cells have aria-selected attribute", () => {
    const visual = { pass: snap.length > 500, message: "Cells rendered" }
    const semantic = assertHasAriaAttribute(snap, "selected")
    const result = dualLayerAssert(visual, semantic)
    console.log("aria-selected:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("cells are keyboard-focusable (gridcell role present)", () => {
    const visual = { pass: true, message: "Cells visible" }
    const semantic = assertHasRole(snap, "gridcell")
    const result = dualLayerAssert(visual, semantic)
    console.log("Keyboard focusable cells:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- TRAP #25: edit mode ---

  it("cells have aria-readonly attribute", () => {
    const visual = { pass: true, message: "Cells appear editable on double-click" }
    const semantic = assertHasAriaAttribute(snap, "readonly")
    const result = dualLayerAssert(visual, semantic)
    console.log("aria-readonly:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- TRAP #27: column resize ---

  it("column resize handles have role=separator", () => {
    const visual = { pass: true, message: "Resize cursors exist visually" }
    const semantic = assertHasRole(snap, "separator")
    const result = dualLayerAssert(visual, semantic)
    console.log("Column resizer:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  it("column resize handles are keyboard-focusable", () => {
    const visual = { pass: true, message: "Resize handles visible" }
    const semantic = assertKeyboardFocusable(snap, "Resize column")
    const result = dualLayerAssert(visual, semantic)
    console.log("Resizer focusable:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- TRAP #28: selection info ---

  it("selection info has role=status with aria-live", () => {
    const visual = {
      pass: snap.includes("A1") || snap.includes("selected"),
      message: "Selection info visible",
    }
    const semantic = assertHasRole(snap, "status")
    const result = dualLayerAssert(visual, semantic)
    console.log("Selection status:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Spreadsheet section is not generic-div-only ---

  it("spreadsheet section has semantic roles (not div soup)", () => {
    const visual = { pass: snap.length > 500, message: "Content renders" }
    const semantic = assertNoGenericOnly(snap, "Spreadsheet")
    const result = dualLayerAssert(visual, semantic)
    console.log("No div soup:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Grid labeling ---

  it("grid has aria-label 'Spreadsheet'", () => {
    const visual = { pass: snap.includes("Sheets"), message: "Page title visible" }
    const semantic = assertHasAriaLabel(snap, "Spreadsheet")
    const result = dualLayerAssert(visual, semantic)
    console.log("Grid label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Live region for announcements ---

  it("has live region for cell announcements", () => {
    const visual = { pass: true, message: "UI renders" }
    // The live region uses aria-live="polite"
    const semantic = assertHasAriaAttribute(snap, "live")
    const result = dualLayerAssert(visual, semantic)
    console.log("Live region:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })

  // --- Cell labels ---

  it("active cell has aria-label with cell reference", () => {
    const visual = { pass: true, message: "Cell content visible" }
    // Active cell should have label like "A1: Category"
    const semantic = assertHasAriaLabel(snap, "A1")
    const result = dualLayerAssert(visual, semantic)
    console.log("Cell label:\n" + result.log)
    expect(result.semanticPass).toBe(true)
  })
})
