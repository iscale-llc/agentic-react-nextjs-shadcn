"use client"

import { useRef, useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AvatarUpload() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)

  function handleUpload() {
    fileRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setStatus(`Uploaded: ${file.name}`)
    }
  }

  if (trapsEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            onClick={handleUpload} // TRAP: div trigger for file input
            className="w-20 h-20 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-accent text-muted-foreground text-sm"
          >
            JD
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {status && <p className="text-sm text-muted-foreground mt-2">{status}</p>}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <button
          onClick={handleUpload}
          aria-label="Upload avatar"
          className="w-20 h-20 rounded-full bg-muted flex items-center justify-center hover:bg-accent text-muted-foreground text-sm"
        >
          JD
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" aria-label="Choose avatar file" />
        <div aria-live="polite" className="mt-2">
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
