"use client"

import { useEffect } from "react"

const HYDRATION_PATTERNS = [
  "Hydration failed",
  "Text content does not match",
  "did not match",
  "hydrating",
  "Hydration",
  "server-rendered HTML",
]

export function HydrationSignal() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true"

    const originalError = console.error
    const errors: string[] = []

    console.error = (...args: unknown[]) => {
      const msg = args.map(String).join(" ")
      if (HYDRATION_PATTERNS.some((p) => msg.includes(p))) {
        errors.push(msg.slice(0, 500))
        document.documentElement.dataset.hydrationErrors = JSON.stringify(errors)

        // Also render into a hidden DOM node agent-browser can read
        let el = document.getElementById("__hydration-errors")
        if (!el) {
          el = document.createElement("div")
          el.id = "__hydration-errors"
          el.setAttribute("role", "log")
          el.setAttribute("aria-label", "Hydration errors")
          el.setAttribute("aria-live", "polite")
          el.style.display = "none"
          document.body.appendChild(el)
        }
        const entry = document.createElement("p")
        entry.textContent = msg.slice(0, 500)
        el.appendChild(entry)
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
