"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ColorTheme = {
  name: string
  label: string
  gradientFrom: string
  gradientVia: string
  gradientTo: string
  primaryColor: string
  secondaryColor: string
  bgGradient: string
  buttonGradient: string
  textGradient: string
}

export const colorThemes: Record<string, ColorTheme> = {
  sunset: {
    name: "sunset",
    label: "Sunset",
    gradientFrom: "from-orange-400",
    gradientVia: "via-pink-500",
    gradientTo: "to-purple-600",
    primaryColor: "orange-500",
    secondaryColor: "pink-600",
    bgGradient: "from-orange-50 via-pink-100 to-purple-200",
    buttonGradient: "from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700",
    textGradient: "from-orange-600 to-pink-700",
  },
  ocean: {
    name: "ocean",
    label: "Ocean",
    gradientFrom: "from-cyan-400",
    gradientVia: "via-blue-500",
    gradientTo: "to-indigo-600",
    primaryColor: "cyan-500",
    secondaryColor: "blue-600",
    bgGradient: "from-cyan-50 via-blue-100 to-indigo-200",
    buttonGradient: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
    textGradient: "from-cyan-600 to-blue-700",
  },
  forest: {
    name: "forest",
    label: "Forest",
    gradientFrom: "from-green-400",
    gradientVia: "via-emerald-500",
    gradientTo: "to-teal-600",
    primaryColor: "green-500",
    secondaryColor: "emerald-600",
    bgGradient: "from-green-50 via-emerald-100 to-teal-200",
    buttonGradient: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    textGradient: "from-green-600 to-emerald-700",
  },
  lavender: {
    name: "lavender",
    label: "Lavender",
    gradientFrom: "from-purple-400",
    gradientVia: "via-violet-500",
    gradientTo: "to-fuchsia-600",
    primaryColor: "purple-500",
    secondaryColor: "violet-600",
    bgGradient: "from-purple-50 via-violet-100 to-fuchsia-200",
    buttonGradient: "from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
    textGradient: "from-purple-600 to-violet-700",
  },
  cherry: {
    name: "cherry",
    label: "Cherry",
    gradientFrom: "from-red-400",
    gradientVia: "via-rose-500",
    gradientTo: "to-pink-600",
    primaryColor: "red-500",
    secondaryColor: "rose-600",
    bgGradient: "from-red-50 via-rose-100 to-pink-200",
    buttonGradient: "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
    textGradient: "from-red-600 to-rose-700",
  },
  monochrome: {
    name: "monochrome",
    label: "Monochrome",
    gradientFrom: "from-gray-400",
    gradientVia: "via-gray-500",
    gradientTo: "to-gray-600",
    primaryColor: "gray-500",
    secondaryColor: "gray-600",
    bgGradient: "from-gray-50 via-gray-100 to-gray-200",
    buttonGradient: "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
    textGradient: "from-gray-600 to-gray-700",
  },
}

type ThemeContextType = {
  theme: ColorTheme
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>(colorThemes.sunset)

  useEffect(() => {
    // Load theme from localStorage on initial render
    const savedTheme = localStorage.getItem("deepwork-theme")
    if (savedTheme && colorThemes[savedTheme]) {
      setThemeState(colorThemes[savedTheme])
    }
  }, [])

  const setTheme = (themeName: string) => {
    if (colorThemes[themeName]) {
      setThemeState(colorThemes[themeName])
      localStorage.setItem("deepwork-theme", themeName)
    }
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
