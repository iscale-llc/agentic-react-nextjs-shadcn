"use client"

import { trapsEnabled } from "@/lib/traps"

export function FormatToolbar() {
  if (trapsEnabled) {
    // TRAP 26: color-only formatting indicators — no programmatic state
    // Formatting buttons show state only via color, no aria-pressed, no sr-only text
    return (
      <div className="flex items-center border-b px-2 py-1 gap-1 bg-muted/30"> {/* TRAP: no role="toolbar", no aria-label */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="px-2 py-0.5 text-xs font-bold cursor-pointer rounded hover:bg-muted"
          onClick={() => {}} // TRAP: no keyboard, no aria-pressed
        >
          B
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="px-2 py-0.5 text-xs italic cursor-pointer rounded hover:bg-muted"
          onClick={() => {}} // TRAP: no keyboard, no aria-pressed
        >
          I
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="px-2 py-0.5 text-xs cursor-pointer rounded hover:bg-muted text-green-600"
          onClick={() => {}} // TRAP: color-only indicator for currency format
        >
          $
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="px-2 py-0.5 text-xs cursor-pointer rounded hover:bg-muted text-blue-600"
          onClick={() => {}} // TRAP: color-only indicator for formula
        >
          fx
        </div>
      </div>
    )
  }

  // FIXED: accessible toolbar with aria-pressed and labels
  return (
    <div role="toolbar" aria-label="Cell formatting" className="flex items-center border-b px-2 py-1 gap-1 bg-muted/30">
      <button
        type="button"
        aria-label="Bold"
        aria-pressed={false}
        className="px-2 py-0.5 text-xs font-bold rounded hover:bg-muted"
      >
        B
      </button>
      <button
        type="button"
        aria-label="Italic"
        aria-pressed={false}
        className="px-2 py-0.5 text-xs italic rounded hover:bg-muted"
      >
        I
      </button>
      <button
        type="button"
        aria-label="Currency format"
        aria-pressed={false}
        className="px-2 py-0.5 text-xs rounded hover:bg-muted text-green-600"
      >
        $
        <span className="sr-only">(currency format)</span>
      </button>
      <button
        type="button"
        aria-label="Formula"
        aria-pressed={false}
        className="px-2 py-0.5 text-xs rounded hover:bg-muted text-blue-600"
      >
        fx
        <span className="sr-only">(formula)</span>
      </button>
    </div>
  )
}
