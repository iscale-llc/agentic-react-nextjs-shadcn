"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileSection() {
  const [name, setName] = useState("Jane Doe")
  const [email, setEmail] = useState("jane@example.com")
  const [bio, setBio] = useState("")

  if (trapsEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TRAP: inputs with placeholder, no label */}
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          />
          <textarea
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="text-sm font-medium">Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background mt-1"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="text-sm font-medium">Email</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background mt-1"
          />
        </div>
        <div>
          <label htmlFor="profile-bio" className="text-sm font-medium">Bio</label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )
}
