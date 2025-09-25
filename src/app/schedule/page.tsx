import type { Metadata } from "next"
import CalendarMonth from "@/components/CalendarMonth"

export const metadata: Metadata = {
  title: "Schedule",
  description: "Monthly calendar with events",
}

export default function Page() {
  // DEMO 事件資料
  const events = {
    "2025-09-03": [{ title: "Design review", time: "10:00", color: "#2563eb" }, { title: "Sales meeting", time: "14:00" }],
    "2025-09-07": [{ title: "Date night", time: "18:00", color: "#f59e0b" }],
    "2025-09-12": [{ title: "Sam's birthday", time: "14:00", color: "#ef4444" }],
    "2025-09-22": [{ title: "Cinema with friends", time: "21:00", color: "#10b981" }, { title: "Hockey game", time: "19:00", color: "#6b7280" }],
    "2025-10-04": [{ title: "Team offsite", time: "09:00" }],
  }

  return (
    <main className="container mx-auto px-4">
      <CalendarMonth events={events} />
    </main>
  )
}
