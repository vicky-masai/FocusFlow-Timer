"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BlockedSitesList } from "@/components/blocked-sites-list"

// Timer states
type TimerState = "idle" | "work" | "break" | "longBreak"
type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

export function TimerDashboard() {
  // Default Pomodoro settings
  const defaultSettings = {
    pomodoro: 25 * 60, // 25 minutes in seconds
    shortBreak: 5 * 60, // 5 minutes in seconds
    longBreak: 15 * 60, // 15 minutes in seconds
    cycles: 4, // Number of pomodoros before a long break
  }

  // State
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [currentMode, setCurrentMode] = useState<TimerMode>("pomodoro")
  const [timeRemaining, setTimeRemaining] = useState(defaultSettings.pomodoro)
  const [isActive, setIsActive] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [abortDialogOpen, setAbortDialogOpen] = useState(false)
  const [abortReason, setAbortReason] = useState("")
  const { toast } = useToast()

  // Calculate total time for current mode
  const getTotalTime = () => {
    switch (currentMode) {
      case "pomodoro":
        return defaultSettings.pomodoro
      case "shortBreak":
        return defaultSettings.shortBreak
      case "longBreak":
        return defaultSettings.longBreak
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = getTotalTime()
    return ((totalTime - timeRemaining) / totalTime) * 100
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeRemaining === 0) {
      // Timer completed
      handleTimerComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining])

  // Handle timer completion
  const handleTimerComplete = () => {
    const audio = new Audio("/notification.mp3") // This would be a notification sound
    audio.play().catch((e) => console.log("Audio play failed:", e))

    if (currentMode === "pomodoro") {
      // Completed a pomodoro
      setCompletedPomodoros((prev) => prev + 1)
      toast({
        title: "Pomodoro completed!",
        description: "Time for a break.",
      })

      // Determine if it's time for a short break or long break
      if (completedPomodoros % defaultSettings.cycles === defaultSettings.cycles - 1) {
        // Time for a long break
        setCurrentMode("longBreak")
        setTimeRemaining(defaultSettings.longBreak)
        setTimerState("longBreak")
      } else {
        // Time for a short break
        setCurrentMode("shortBreak")
        setTimeRemaining(defaultSettings.shortBreak)
        setTimerState("break")
      }
    } else {
      // Break completed
      toast({
        title: "Break completed!",
        description: "Time to focus again.",
      })
      setCurrentMode("pomodoro")
      setTimeRemaining(defaultSettings.pomodoro)
      setTimerState("work")
    }

    // Automatically start the next timer
    setIsActive(true)
  }

  // Start timer
  const startTimer = () => {
    if (timerState === "idle") {
      setTimerState("work")
    }
    setIsActive(true)

    // Log session start
    if (currentMode === "pomodoro") {
      console.log("Session started:", new Date())
      // Here you would log to your database
    }
  }

  // Pause timer
  const pauseTimer = () => {
    setIsActive(false)
  }

  // Reset timer
  const resetTimer = () => {
    setIsActive(false)
    setTimeRemaining(getTotalTime())
  }

  // Switch timer mode
  const switchMode = (mode: TimerMode) => {
    setCurrentMode(mode)
    setIsActive(false)

    switch (mode) {
      case "pomodoro":
        setTimeRemaining(defaultSettings.pomodoro)
        setTimerState(isActive ? "work" : "idle")
        break
      case "shortBreak":
        setTimeRemaining(defaultSettings.shortBreak)
        setTimerState("break")
        break
      case "longBreak":
        setTimeRemaining(defaultSettings.longBreak)
        setTimerState("longBreak")
        break
    }
  }

  // Abort session
  const abortSession = () => {
    // Log the aborted session with reason
    console.log("Session aborted:", new Date(), abortReason)

    // Reset the timer
    setIsActive(false)
    setCurrentMode("pomodoro")
    setTimeRemaining(defaultSettings.pomodoro)
    setTimerState("idle")
    setAbortDialogOpen(false)

    toast({
      title: "Session aborted",
      description: "Your session has been aborted and logged.",
    })
  }

  return (
    <div className="grid gap-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl">FocusFlow Timer</CardTitle>
          <CardDescription className="text-center">
            Stay focused and productive with the Pomodoro technique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2">
            <Button variant={currentMode === "pomodoro" ? "default" : "outline"} onClick={() => switchMode("pomodoro")}>
              Pomodoro
            </Button>
            <Button
              variant={currentMode === "shortBreak" ? "default" : "outline"}
              onClick={() => switchMode("shortBreak")}
            >
              Short Break
            </Button>
            <Button
              variant={currentMode === "longBreak" ? "default" : "outline"}
              onClick={() => switchMode("longBreak")}
            >
              Long Break
            </Button>
          </div>

          <div className="text-center">
            <div className="text-7xl font-bold my-8">{formatTime(timeRemaining)}</div>
            <Progress value={calculateProgress()} className="h-2 mb-6" />
          </div>

          <div className="flex justify-center gap-2">
            {!isActive ? (
              <Button size="lg" onClick={startTimer}>
                Start
              </Button>
            ) : (
              <Button size="lg" onClick={pauseTimer}>
                Pause
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={resetTimer}>
              Reset
            </Button>
            <Dialog open={abortDialogOpen} onOpenChange={setAbortDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="destructive">
                  Abort
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Abort Session</DialogTitle>
                  <DialogDescription>Please provide a reason for aborting this session.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Why are you aborting this session?"
                      value={abortReason}
                      onChange={(e) => setAbortReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAbortDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={abortSession}>
                    Abort Session
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <span className="font-semibold">Completed today:</span> {completedPomodoros} pomodoros
          </div>
          <div>
            {timerState === "work" ? (
              <span className="text-green-500 font-semibold">Focus Time</span>
            ) : timerState === "break" || timerState === "longBreak" ? (
              <span className="text-blue-500 font-semibold">Break Time</span>
            ) : (
              <span className="text-gray-500">Ready to start</span>
            )}
          </div>
        </CardFooter>
      </Card>

      {timerState === "work" && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Distraction Blocking Active</CardTitle>
            <CardDescription>The following sites are blocked during your focus session</CardDescription>
          </CardHeader>
          <CardContent>
            <BlockedSitesList />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
