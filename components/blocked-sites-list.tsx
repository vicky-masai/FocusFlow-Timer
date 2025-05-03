"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for blocked sites
const defaultBlockedSites = [
  { id: 1, domain: "facebook.com", isBlocked: true },
  { id: 2, domain: "twitter.com", isBlocked: true },
  { id: 3, domain: "instagram.com", isBlocked: true },
  { id: 4, domain: "youtube.com", isBlocked: true },
  { id: 5, domain: "reddit.com", isBlocked: true },
]

export function BlockedSitesList() {
  const [blockedSites, setBlockedSites] = useState(defaultBlockedSites)

  // In a real app, this would check if the current site is blocked
  // and redirect or show a blocking screen
  useEffect(() => {
    // Simulate checking current URL against blocked list
    const checkBlockedSites = () => {
      console.log("Checking for blocked sites...")
      // In a real implementation, this would be handled by a browser extension
      // that would check the current URL against the blocked list
    }

    const interval = setInterval(checkBlockedSites, 5000)
    return () => clearInterval(interval)
  }, [blockedSites])

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Distraction blocking active</AlertTitle>
        <AlertDescription>
          These sites are currently blocked to help you stay focused. They will be unblocked during your break.
        </AlertDescription>
      </Alert>

      <div className="grid gap-2">
        {blockedSites.map((site) => (
          <div key={site.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="font-medium">{site.domain}</span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Blocked</span>
          </div>
        ))}
      </div>
    </div>
  )
}
