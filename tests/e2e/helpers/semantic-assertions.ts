/**
 * Reusable snapshot-based semantic assertion helpers.
 * Each parses agent-browser snapshot output (accessibility tree text).
 */

export interface AssertionResult {
  pass: boolean
  message: string
}

/** Check that snapshot contains at least one element with given role */
export function assertHasRole(snap: string, role: string): AssertionResult {
  // agent-browser snapshot format: `role "label"` or just `role` at line start
  const regex = new RegExp(`\\b${role}\\b`, "i")
  const pass = regex.test(snap)
  return {
    pass,
    message: pass
      ? `Found role="${role}"`
      : `Missing role="${role}" in snapshot`,
  }
}

/** Check that snapshot contains at least `min` elements with given role */
export function assertHasRoleCount(
  snap: string,
  role: string,
  min: number
): AssertionResult {
  // Count occurrences of role as a standalone word (line-start roles in snapshot)
  const regex = new RegExp(`\\b${role}\\b`, "gi")
  const matches = snap.match(regex) ?? []
  const count = matches.length
  const pass = count >= min
  return {
    pass,
    message: pass
      ? `Found ${count} "${role}" elements (min: ${min})`
      : `Only ${count} "${role}" elements, expected at least ${min}`,
  }
}

/** Check that snapshot contains a specific aria-label text */
export function assertHasAriaLabel(
  snap: string,
  label: string
): AssertionResult {
  // agent-browser snapshot shows aria-label as quoted text after role: `role "label text"`
  const pass = snap.includes(`"${label}"`) || snap.toLowerCase().includes(label.toLowerCase())
  return {
    pass,
    message: pass
      ? `Found aria-label "${label}"`
      : `Missing aria-label "${label}" in snapshot`,
  }
}

/** Check that snapshot contains a specific aria attribute (e.g. "aria-selected", "aria-readonly") */
export function assertHasAriaAttribute(
  snap: string,
  attr: string
): AssertionResult {
  const regex = new RegExp(attr, "i")
  const pass = regex.test(snap)
  return {
    pass,
    message: pass
      ? `Found ${attr} in snapshot`
      : `Missing ${attr} in snapshot`,
  }
}

/** Check that a named element is interactive (button, link, textbox, etc.) */
export function assertInteractiveElement(
  snap: string,
  name: string
): AssertionResult {
  // Look for interactive roles near the name
  const interactiveRoles = [
    "button",
    "link",
    "textbox",
    "checkbox",
    "radio",
    "switch",
    "combobox",
    "menuitem",
    "tab",
    "slider",
    "spinbutton",
    "searchbox",
  ]

  // Search lines containing the name
  const lines = snap.split("\n")
  const nameLines = lines.filter((l) =>
    l.toLowerCase().includes(name.toLowerCase())
  )

  const pass = nameLines.some((line) =>
    interactiveRoles.some((role) => line.toLowerCase().includes(role))
  )

  return {
    pass,
    message: pass
      ? `"${name}" is an interactive element`
      : `"${name}" is NOT interactive (no button/link/textbox/etc role found)`,
  }
}

/** Check that a section doesn't consist solely of generic divs */
export function assertNoGenericOnly(
  snap: string,
  section: string
): AssertionResult {
  const lines = snap.split("\n")
  const sectionIdx = lines.findIndex((l) =>
    l.toLowerCase().includes(section.toLowerCase())
  )
  if (sectionIdx === -1) {
    return { pass: false, message: `Section "${section}" not found` }
  }

  // Check next 20 lines for semantic roles
  const sectionLines = lines.slice(sectionIdx, sectionIdx + 20)
  const semanticRoles = [
    "grid",
    "row",
    "gridcell",
    "columnheader",
    "rowheader",
    "button",
    "link",
    "textbox",
    "toolbar",
    "separator",
    "switch",
    "radio",
    "radiogroup",
    "checkbox",
    "dialog",
    "status",
    "table",
    "cell",
    "heading",
  ]
  const hasSemanticRole = sectionLines.some((line) =>
    semanticRoles.some((role) => {
      const regex = new RegExp(`\\b${role}\\b`, "i")
      return regex.test(line)
    })
  )

  return {
    pass: hasSemanticRole,
    message: hasSemanticRole
      ? `Section "${section}" has semantic roles`
      : `Section "${section}" is generic-div-only (no semantic roles)`,
  }
}

/** Check that an element appears to be keyboard focusable (has tabIndex or is interactive role) */
export function assertKeyboardFocusable(
  snap: string,
  name: string
): AssertionResult {
  const lines = snap.split("\n")
  const nameLines = lines.filter((l) =>
    l.toLowerCase().includes(name.toLowerCase())
  )

  // In agent-browser snapshot, focusable elements show as interactive roles
  // or have "focused" state. Check for interactive roles.
  const focusableIndicators = [
    "button",
    "link",
    "textbox",
    "checkbox",
    "radio",
    "switch",
    "tab",
    "slider",
    "gridcell",
    "separator",
    "combobox",
    "menuitem",
    "searchbox",
    "spinbutton",
    "focused",
  ]

  const pass = nameLines.some((line) =>
    focusableIndicators.some((ind) => line.toLowerCase().includes(ind))
  )

  return {
    pass,
    message: pass
      ? `"${name}" appears keyboard-focusable`
      : `"${name}" does NOT appear keyboard-focusable`,
  }
}

/**
 * Dual-layer test helper. Runs both visual and semantic assertions,
 * logs results for both layers. Returns combined result.
 */
export function dualLayerAssert(
  visual: AssertionResult,
  semantic: AssertionResult
): { pass: boolean; visualPass: boolean; semanticPass: boolean; log: string } {
  const log = [
    `  Visual:   ${visual.pass ? "PASS" : "FAIL"} — ${visual.message}`,
    `  Semantic: ${semantic.pass ? "PASS" : "FAIL"} — ${semantic.message}`,
  ].join("\n")

  return {
    pass: visual.pass && semantic.pass,
    visualPass: visual.pass,
    semanticPass: semantic.pass,
    log,
  }
}
