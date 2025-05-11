"use client"

import { useTheme, colorThemes } from "@/contexts/theme-context"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.values(colorThemes).map((colorTheme) => (
          <DropdownMenuItem
            key={colorTheme.name}
            onClick={() => setTheme(colorTheme.name)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-4 w-4 rounded-full bg-gradient-to-r",
                  colorTheme.gradientFrom,
                  colorTheme.gradientVia,
                  colorTheme.gradientTo,
                )}
              />
              <span>{colorTheme.label}</span>
            </div>
            {theme.name === colorTheme.name && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
