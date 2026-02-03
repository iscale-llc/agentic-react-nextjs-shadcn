"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userRoles, userStatuses } from "@/lib/validations/user"

export function UsersFilters({
  search,
  role,
  status,
}: {
  search: string | null
  role: string | null
  status: string | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(search ?? "")

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("offset")
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams("search", searchValue || null)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchValue, updateParams])

  return (
    <div className="flex flex-wrap gap-4" role="search" aria-label="Filter users">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search-users" className="sr-only">
          Search users
        </Label>
        <Input
          id="search-users"
          placeholder="Search users..."
          aria-label="Search users"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="w-[150px]">
        <Label htmlFor="filter-role" className="sr-only">
          Filter by role
        </Label>
        <Select
          value={role ?? "all"}
          onValueChange={(v) => updateParams("role", v)}
        >
          <SelectTrigger id="filter-role" aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {userRoles.map((r) => (
              <SelectItem key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-[150px]">
        <Label htmlFor="filter-status" className="sr-only">
          Filter by status
        </Label>
        <Select
          value={status ?? "all"}
          onValueChange={(v) => updateParams("status", v)}
        >
          <SelectTrigger id="filter-status" aria-label="Filter by status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {userStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
