"use client"

import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="health-predictor-theme">
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}