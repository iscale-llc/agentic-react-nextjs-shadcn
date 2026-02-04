"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const themes = [
  { id: "light", color: "bg-white border", label: "Light" },
  { id: "dark", color: "bg-zinc-900", label: "Dark" },
  { id: "system", color: "bg-gradient-to-r from-white to-zinc-900", label: "System" },
]

export function ThemeSelector() {
  const [selected, setSelected] = useState("light")

  if (trapsEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {themes.map((t) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={t.id}
                onClick={() => setSelected(t.id)} // TRAP: color-only swatches, no labels
                className={cn(
                  "w-10 h-10 rounded-full cursor-pointer ring-offset-2 transition-shadow",
                  t.color,
                  selected === t.id ? "ring-2 ring-primary" : ""
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div role="radiogroup" aria-label="Theme selection" className="flex gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              role="radio"
              aria-checked={selected === t.id}
              aria-label={t.label}
              onClick={() => setSelected(t.id)}
              className={cn(
                "w-10 h-10 rounded-full ring-offset-2 transition-shadow",
                t.color,
                selected === t.id ? "ring-2 ring-primary" : ""
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
