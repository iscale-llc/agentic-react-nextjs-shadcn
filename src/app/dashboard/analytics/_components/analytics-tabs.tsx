"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { cn } from "@/lib/utils"
import { tabOptions, type AnalyticsTab } from "@/lib/mock-data/analytics"

export function AnalyticsTabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview")

  if (trapsEnabled) {
    return (
      <div>
        <div className="flex border-b mb-6"> {/* TRAP: div-tabs without role=tablist */}
          {tabOptions.map((tab) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              key={tab}
              onClick={() => setActiveTab(tab)} // TRAP: div-as-tab
              className={cn(
                "px-4 py-2 text-sm cursor-pointer border-b-2 -mb-px transition-colors",
                activeTab === tab
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </div>
          ))}
        </div>
        {activeTab === "Overview" && children}
        {activeTab !== "Overview" && (
          <p className="text-muted-foreground text-sm">
            {activeTab} tab content — placeholder
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <div role="tablist" aria-label="Analytics views" className="flex border-b mb-6">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm border-b-2 -mb-px transition-colors",
              activeTab === tab
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={`${activeTab} content`}>
        {activeTab === "Overview" && children}
        {activeTab !== "Overview" && (
          <p className="text-muted-foreground text-sm">
            {activeTab} tab content — placeholder
          </p>
        )}
      </div>
    </div>
  )
}
