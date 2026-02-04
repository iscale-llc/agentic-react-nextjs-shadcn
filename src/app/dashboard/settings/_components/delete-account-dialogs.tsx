"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { Button } from "@/components/ui/button"

export function DeleteAccountDialogs() {
  const [dialogA, setDialogA] = useState(false)
  const [dialogB, setDialogB] = useState(false)
  const [step, setStep] = useState<"confirm" | "final">("confirm")

  if (trapsEnabled) {
    // TRAP: nested modal inside modal — two aria-modal simultaneously
    return (
      <>
        <Button variant="destructive" size="sm" onClick={() => setDialogA(true)}>
          Delete Account
        </Button>

        {dialogA && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div role="dialog" aria-modal="true" aria-label="Delete account" className="bg-background border rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold">Delete Account</h2>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete your account and all data. This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setDialogA(false)}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => setDialogB(true)}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {dialogB && ( // TRAP: nested modal — dialogA still open behind
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div role="dialog" aria-modal="true" aria-label="Final confirmation" className="bg-background border rounded-lg p-6 w-96 shadow-lg"> {/* TRAP: two aria-modal=true */}
              <h2 className="text-lg font-semibold">Are you absolutely sure?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Type &quot;DELETE&quot; to confirm.
              </p>
              <input className="w-full border rounded-md px-3 py-2 text-sm mt-2 bg-background" placeholder="Type DELETE" />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setDialogB(false)}>Back</Button>
                <Button variant="destructive" size="sm" onClick={() => { setDialogA(false); setDialogB(false) }}>
                  Delete Forever
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Fixed: single stepped dialog
  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => { setStep("confirm"); setDialogA(true) }}>
        Delete Account
      </Button>

      {dialogA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div role="dialog" aria-modal="true" aria-label="Delete account confirmation" className="bg-background border rounded-lg p-6 w-96 shadow-lg">
            {step === "confirm" ? (
              <>
                <h2 className="text-lg font-semibold">Delete Account</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  This will permanently delete your account and all data. This action cannot be undone.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setDialogA(false)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={() => setStep("final")}>
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Are you absolutely sure?</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Type &quot;DELETE&quot; to confirm.
                </p>
                <label htmlFor="delete-confirm" className="sr-only">Type DELETE to confirm</label>
                <input id="delete-confirm" className="w-full border rounded-md px-3 py-2 text-sm mt-2 bg-background" />
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setStep("confirm")}>Back</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDialogA(false)}>
                    Delete Forever
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
