"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, XCircle } from "lucide-react"

// Mock data for session history
const mockSessionHistory = [
  {
    id: 1,
    date: "2023-05-07",
    startTime: "09:30",
    duration: 25,
    type: "pomodoro",
    status: "completed",
    notes: "",
  },
  {
    id: 2,
    date: "2023-05-07",
    startTime: "10:00",
    duration: 5,
    type: "break",
    status: "completed",
    notes: "",
  },
  {
    id: 3,
    date: "2023-05-07",
    startTime: "10:10",
    duration: 25,
    type: "pomodoro",
    status: "completed",
    notes: "",
  },
  {
    id: 4,
    date: "2023-05-07",
    startTime: "10:40",
    duration: 5,
    type: "break",
    status: "completed",
    notes: "",
  },
  {
    id: 5,
    date: "2023-05-07",
    startTime: "10:50",
    duration: 25,
    type: "pomodoro",
    status: "interrupted",
    notes: "Unexpected meeting",
  },
  {
    id: 6,
    date: "2023-05-06",
    startTime: "14:00",
    duration: 25,
    type: "pomodoro",
    status: "completed",
    notes: "",
  },
  {
    id: 7,
    date: "2023-05-06",
    startTime: "14:30",
    duration: 5,
    type: "break",
    status: "completed",
    notes: "",
  },
  {
    id: 8,
    date: "2023-05-06",
    startTime: "14:40",
    duration: 25,
    type: "pomodoro",
    status: "completed",
    notes: "",
  },
]

export default function HistoryPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter sessions based on type and search query
  const filteredSessions = mockSessionHistory.filter((session) => {
    const matchesFilter = filter === "all" || session.type === filter
    const matchesSearch = session.notes.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && (searchQuery === "" || matchesSearch)
  })

  // Group sessions by date
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = session.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(session)
    return groups
  }, {})

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Session History</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search session notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="pomodoro">Pomodoros</SelectItem>
            <SelectItem value="break">Breaks</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Export Data</Button>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedSessions).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Clock className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No sessions found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or start a new session</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedSessions)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
            .map(([date, sessions]) => (
              <Card key={date}>
                <CardHeader className="pb-2">
                  <CardTitle>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>{sessions.length} sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.startTime}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                session.type === "pomodoro" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {session.type === "pomodoro" ? "Pomodoro" : "Break"}
                            </span>
                          </TableCell>
                          <TableCell>{session.duration} min</TableCell>
                          <TableCell>
                            {session.status === "completed" ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>Completed</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                <span>Interrupted</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{session.notes || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
