"use client"

import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"       // 讓 <html> 加上 class="dark"
      defaultTheme="system"   // 預設跟隨系統
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
