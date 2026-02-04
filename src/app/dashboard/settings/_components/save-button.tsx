"use client"

import { trapsEnabled } from "@/lib/traps"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function SaveButton() {
  function handleSave() {
    toast.success("Settings saved")
  }

  if (trapsEnabled) {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={handleSave} // TRAP: div styled as button
        className="inline-flex items-center justify-center h-9 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90"
      >
        Save Changes
      </div>
    )
  }

  return (
    <Button onClick={handleSave}>
      Save Changes
    </Button>
  )
}
