"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const notifications = [
  { id: "email", label: "Email notifications" },
  { id: "push", label: "Push notifications" },
  { id: "sms", label: "SMS alerts" },
]

export function NotificationToggles() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    email: true,
    push: false,
    sms: false,
  })

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (trapsEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between">
              <span className="text-sm">{n.label}</span>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <div
                onClick={() => toggle(n.id)} // TRAP: div-based toggle, not checkbox
                className={cn(
                  "w-10 h-6 rounded-full relative cursor-pointer transition-colors",
                  enabled[n.id] ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  enabled[n.id] ? "translate-x-4" : "translate-x-0.5"
                )} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-center justify-between">
            <span className="text-sm" id={`toggle-label-${n.id}`}>{n.label}</span>
            <button
              role="switch"
              aria-checked={enabled[n.id]}
              aria-labelledby={`toggle-label-${n.id}`}
              onClick={() => toggle(n.id)}
              className={cn(
                "w-10 h-6 rounded-full relative transition-colors",
                enabled[n.id] ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                enabled[n.id] ? "translate-x-4" : "translate-x-0.5"
              )} />
              <span className="sr-only">{enabled[n.id] ? "On" : "Off"}</span>
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
