"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import ThemeSelector from "@/components/theme-selector"

const backgroundPatterns = [
  {
    name: "None",
    className: "",
  },
  {
    name: "Dots",
    className: "bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[size:20px_20px]",
  },
  {
    name: "Grid",
    className: "bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px]",
  },
  {
    name: "Waves",
    className: "bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[size:30px_30px] [background-position:0_0,15px_15px]",
  },
  {
    name: "Hexagons",
    className: "bg-[linear-gradient(60deg,#000_25%,transparent_25.5%,transparent_75%,#000_75%,#000),linear-gradient(120deg,#000_25%,transparent_25.5%,transparent_75%,#000_75%,#000)] bg-[size:20px_35px]",
  },
]

export default function DeepWorkTimer() {
  const { theme } = useTheme()
  const [duration, setDuration] = useState(25 * 60) // Default: 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(25)
  const [selectedPattern, setSelectedPattern] = useState(backgroundPatterns[0])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate progress percentage
  const progress = ((duration - timeLeft) / duration) * 100

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours > 0 ? String(hours).padStart(2, "0") : null,
      String(minutes).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":")
  }

  // Handle timer start/pause
  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Apply settings
  const applySettings = () => {
    const newDuration = selectedDuration * 60
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setSettingsOpen(false)
    resetTimer()
  }

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            clearInterval(intervalRef.current as NodeJS.Timeout)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Play notification sound when timer completes
  useEffect(() => {
    if (timeLeft === 0) {
      // We could add a sound notification here in a future enhancement
      document.title = "Time's up! - DeepWork Timer"
    } else {
      document.title = isRunning ? `${formatTime(timeLeft)} - DeepWork Timer` : "DeepWork Timer"
    }

    return () => {
      document.title = "DeepWork Timer"
    }
  }, [timeLeft, isRunning])

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b ${theme.bgGradient} -m-4 p-4 flex items-center justify-center`}
    >
      <div className="relative w-full max-w-md">
        <div
          className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} opacity-70 blur-lg`}
        ></div>
        <Card className="relative overflow-hidden rounded-xl border-0 bg-white/90 shadow-xl backdrop-blur-sm">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom.replace("from-", "from-")}/10 ${theme.gradientVia.replace("via-", "via-")}/10 ${theme.gradientTo.replace("to-", "to-")}/10`}
          ></div>
          <div className={cn("absolute inset-0 opacity-5", selectedPattern.className)}></div>
          <CardHeader className="pb-4 relative">
            <div className="flex items-center justify-between">
              <CardTitle
                className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
              >
                DeepWork Timer
              </CardTitle>
              <div className="flex items-center gap-2">
                <ThemeSelector />
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100">
                      <Settings2 className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm">
                    <DialogHeader>
                      <DialogTitle className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                        Timer Settings
                      </DialogTitle>
                      <DialogDescription>Adjust your deep work session duration.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className={`font-medium bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
                        >
                          Session Duration: {selectedDuration} minutes
                        </span>
                      </div>
                      <Slider
                        value={[selectedDuration]}
                        min={5}
                        max={120}
                        step={5}
                        onValueChange={(value) => setSelectedDuration(value[0])}
                        className="mb-6"
                      />
                      <div className="mb-6">
                        <span className={`font-medium bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2 block`}>
                          Background Pattern
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {backgroundPatterns.map((pattern) => (
                            <Button
                              key={pattern.name}
                              variant={selectedPattern.name === pattern.name ? "default" : "outline"}
                              onClick={() => setSelectedPattern(pattern)}
                              className={cn(
                                "w-full justify-start",
                                selectedPattern.name === pattern.name && `bg-gradient-to-r ${theme.buttonGradient} text-white border-0`
                              )}
                            >
                              {pattern.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={applySettings}
                        className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white border-0`}
                      >
                        Apply Settings
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2 relative">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-white shadow-inner transition-all duration-300">
                <div
                  className={cn(
                    "absolute inset-0 rounded-full",
                    `bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} opacity-20`,
                    isRunning ? "animate-pulse" : "",
                  )}
                  style={{
                    clipPath: `circle(${progress}% at center)`,
                  }}
                ></div>
                <div className="absolute inset-2 rounded-full bg-white/95 backdrop-blur-sm"></div>
                <span
                  className="relative text-8xl font-bold tracking-tight text-gray-800"
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
                indicatorClassName={`bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo}`}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-4 pb-6 relative">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              disabled={timeLeft === duration && !isRunning}
              className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="sr-only">Reset</span>
            </Button>
            <Button
              size="lg"
              onClick={toggleTimer}
              className={cn(
                "px-8 transition-all duration-300 border-0",
                `bg-gradient-to-r ${theme.buttonGradient}`,
                "disabled:opacity-50",
                isRunning ? "shadow-lg" : "shadow-md",
              )}
              disabled={timeLeft === 0}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
