"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [newSite, setNewSite] = useState("")

  // Mock data for blocked sites
  const [blockedSites, setBlockedSites] = useState([
    { id: 1, domain: "facebook.com" },
    { id: 2, domain: "twitter.com" },
    { id: 3, domain: "instagram.com" },
    { id: 4, domain: "youtube.com" },
    { id: 5, domain: "reddit.com" },
  ])

  // Timer settings
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    cycles: 4,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    soundEnabled: true,
    notificationsEnabled: true,
    volume: 80,
  })

  // Add a new site to block
  const addSite = () => {
    if (!newSite) return

    // Simple validation for domain format
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(newSite)) {
      toast({
        title: "Invalid domain",
        description: "Please enter a valid domain (e.g., example.com)",
        variant: "destructive",
      })
      return
    }

    // Check if site already exists
    if (blockedSites.some((site) => site.domain === newSite)) {
      toast({
        title: "Domain already exists",
        description: "This domain is already in your blocklist",
        variant: "destructive",
      })
      return
    }

    setBlockedSites([...blockedSites, { id: Date.now(), domain: newSite }])
    setNewSite("")

    toast({
      title: "Site added",
      description: `${newSite} has been added to your blocklist`,
    })
  }

  // Remove a site from the blocklist
  const removeSite = (id: number) => {
    setBlockedSites(blockedSites.filter((site) => site.id !== id))

    toast({
      title: "Site removed",
      description: "The site has been removed from your blocklist",
    })
  }

  // Save timer settings
  const saveTimerSettings = () => {
    // In a real app, this would save to a database
    console.log("Saving timer settings:", timerSettings)

    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated",
    })
  }

  // Save notification settings
  const saveNotificationSettings = () => {
    // In a real app, this would save to a database
    console.log("Saving notification settings:", notificationSettings)

    toast({
      title: "Settings saved",
      description: "Your notification settings have been updated",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="timer" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="blocklist">Distraction Blocklist</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="timer">
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Customize your Pomodoro timer intervals and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pomodoro">Pomodoro Duration (minutes)</Label>
                  <Input
                    id="pomodoro"
                    type="number"
                    min="1"
                    max="60"
                    value={timerSettings.pomodoro}
                    onChange={(e) =>
                      setTimerSettings({
                        ...timerSettings,
                        pomodoro: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shortBreak">Short Break Duration (minutes)</Label>
                  <Input
                    id="shortBreak"
                    type="number"
                    min="1"
                    max="30"
                    value={timerSettings.shortBreak}
                    onChange={(e) =>
                      setTimerSettings({
                        ...timerSettings,
                        shortBreak: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="longBreak">Long Break Duration (minutes)</Label>
                  <Input
                    id="longBreak"
                    type="number"
                    min="1"
                    max="60"
                    value={timerSettings.longBreak}
                    onChange={(e) =>
                      setTimerSettings({
                        ...timerSettings,
                        longBreak: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cycles">Pomodoros before Long Break</Label>
                  <Input
                    id="cycles"
                    type="number"
                    min="1"
                    max="10"
                    value={timerSettings.cycles}
                    onChange={(e) =>
                      setTimerSettings({
                        ...timerSettings,
                        cycles: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoStartBreaks">Auto-start Breaks</Label>
                  <Switch
                    id="autoStartBreaks"
                    checked={timerSettings.autoStartBreaks}
                    onCheckedChange={(checked) =>
                      setTimerSettings({
                        ...timerSettings,
                        autoStartBreaks: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoStartPomodoros">Auto-start Pomodoros</Label>
                  <Switch
                    id="autoStartPomodoros"
                    checked={timerSettings.autoStartPomodoros}
                    onCheckedChange={(checked) =>
                      setTimerSettings({
                        ...timerSettings,
                        autoStartPomodoros: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={saveTimerSettings}>Save Timer Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocklist">
          <Card>
            <CardHeader>
              <CardTitle>Distraction Blocklist</CardTitle>
              <CardDescription>Add websites that will be blocked during your focus sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter domain (e.g., facebook.com)"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSite()
                    }
                  }}
                />
                <Button onClick={addSite}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {blockedSites.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No sites in your blocklist yet. Add some to stay focused!
                  </p>
                ) : (
                  blockedSites.map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span>{site.domain}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeSite(site.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Customize how you want to be notified during your sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="soundEnabled">Sound Notifications</Label>
                  <Switch
                    id="soundEnabled"
                    checked={notificationSettings.soundEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        soundEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notificationsEnabled">Desktop Notifications</Label>
                  <Switch
                    id="notificationsEnabled"
                    checked={notificationSettings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        notificationsEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume">Volume</Label>
                    <span className="text-sm">{notificationSettings.volume}%</span>
                  </div>
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[notificationSettings.volume]}
                    onValueChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        volume: value[0],
                      })
                    }
                    disabled={!notificationSettings.soundEnabled}
                  />
                </div>
              </div>

              <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
