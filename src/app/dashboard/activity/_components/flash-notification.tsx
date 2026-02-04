"use client"

import { useState, useEffect } from "react"
import { trapsEnabled } from "@/lib/traps"

export function FlashNotification() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!trapsEnabled) return
    // TRAP: 3s auto-dismiss with critical info
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const message = "Database migration #47 completed with 3 warnings. Review recommended."

  if (trapsEnabled) {
    if (!visible) return null // TRAP: critical info removed from DOM after 3s
    return (
      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200"> {/* TRAP: auto-dismiss notification */}
        {message}
      </div>
    )
  }

  // Fixed: persistent, with aria-live
  return (
    <div aria-live="polite" role="log" aria-label="System notifications">
      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
        {message}
      </div>
    </div>
  )
}
