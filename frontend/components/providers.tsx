"use client"

import { ThemeProvider } from "./theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="health-predictor-theme">
      {children}
    </ThemeProvider>
  )
}