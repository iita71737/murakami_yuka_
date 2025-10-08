"use client"

import { useMemo, useState } from "react"

type CalEvent = { id?: string | number; title: string; time?: string; color?: string }
type EventMap = Record<string, CalEvent[]> // key: "YYYY-MM-DD"

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

function monthMatrix(year: number, month: number) {
  // month: 1-12 (UTC 避免時區影響)
  const first = new Date(Date.UTC(year, month - 1, 1))
  const startDay = (first.getUTCDay() + 6) % 7 // 週一=0
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(Date.UTC(year, month - 1, d)))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export default function CalendarMonth({
  initialYear,
  initialMonth,
  events = {},
}: {
  initialYear?: number
  initialMonth?: number
  events?: EventMap
}) {
  const now = useMemo(() => new Date(), [])
  const [year, setYear] = useState(initialYear ?? now.getUTCFullYear())
  const [month, setMonth] = useState(initialMonth ?? now.getUTCMonth() + 1)

  const todayKey = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`
  const weeks = useMemo(() => monthMatrix(year, month), [year, month])

  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  })

  const prev = () => setMonth((m) => (m === 1 ? (setYear((y) => y - 1), 12) : m - 1))
  const next = () => setMonth((m) => (m === 12 ? (setYear((y) => y + 1), 1) : m + 1))
  const today = () => {
    setYear(now.getUTCFullYear())
    setMonth(now.getUTCMonth() + 1)
  }

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="lg:flex lg:min-h-[600px] lg:flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
          <time dateTime={`${year}-${pad(month)}`}>{monthLabel}</time>
        </h1>

        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white dark:bg-gray-900 shadow-sm md:items-stretch">
            <button
              type="button"
              onClick={prev}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 dark:border-gray-700 pr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50/60 dark:md:hover:bg-gray-800"
              aria-label="Previous month"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={today}
              className="hidden border-y border-gray-300 dark:border-gray-700 px-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50/60 dark:hover:bg-gray-800 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 dark:bg-gray-700 md:hidden" />
            <button
              type="button"
              onClick={next}
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 dark:border-gray-700 pl-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50/60 dark:md:hover:bg-gray-800"
              aria-label="Next month"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Grid wrapper */}
      <div className="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col dark:ring-white/10">
        {/* Week headings */}
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 dark:text-gray-300 dark:bg-gray-800 lg:flex-none">
          {weekdays.map((w) => (
            <div key={w} className="flex justify-center bg-white dark:bg-gray-900 py-2">
              <span className="sm:sr-only">{w[0]}</span>
              <span className="sr-only sm:not-sr-only">{w}</span>
            </div>
          ))}
        </div>

        {/* Desktop month: 統一行高 */}
        <div className="hidden w-full bg-gray-200 dark:bg-gray-800 text-xs leading-6 text-gray-700 dark:text-gray-300
                        lg:grid lg:grid-cols-7 lg:[grid-auto-rows:6.75rem] lg:gap-px">
          {weeks.flat().map((date, idx) => {
            if (!date) {
              return (
                <div key={`blank-${idx}`} className="relative h-full bg-gray-50 dark:bg-gray-900/60 px-3 py-2 text-gray-500" />
              )
            }
            const y = date.getUTCFullYear()
            const m = pad(date.getUTCMonth() + 1)
            const d = pad(date.getUTCDate())
            const key = `${y}-${m}-${d}`
            const list = events[key] ?? []
            const isToday = key === todayKey
            const isCurrentMonth = date.getUTCMonth() + 1 === month

            return (
              <div
                key={key}
                className={`relative h-full px-3 py-2 ${
                  isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 text-gray-500 dark:bg-gray-900/60"
                }`}
              >
                <div className="flex h-full flex-col">
                  <time
                    dateTime={key}
                    className={
                      isToday
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                        : ""
                    }
                    aria-label={key}
                  >
                    {parseInt(d, 10)}
                  </time>

                  {list.length > 0 && (
                    <ol className="mt-2 space-y-1 overflow-hidden [max-height:3.75rem]">
                      {list.slice(0, 3).map((ev) => (
                        <li key={ev.id ?? ev.title}>
                          <a href="#" className="group flex items-center" title={ev.title}>
                            <span
                              className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: ev.color || "#6b7280" }}
                            />
                            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                              {ev.title}
                            </p>
                            {ev.time && (
                              <time className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block dark:text-gray-400 dark:group-hover:text-indigo-400">
                                {ev.time}
                              </time>
                            )}
                          </a>
                        </li>
                      ))}
                      {list.length > 3 && (
                        <li className="text-gray-500 dark:text-gray-400">+{list.length - 3} more</li>
                      )}
                    </ol>
                  )}

                  {/* 若希望日期永遠靠上、事件往下填，可以加這個 spacer： */}
                  {/* <div className="mt-auto" /> */}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile month（維持既有小格按鈕） */}
        <div className="isolate grid wfull grid-cols-7 grid-rows-6 gap-px bg-gray-200 dark:bg-gray-800 lg:hidden">
          {weeks.flat().map((date, idx) => {
            if (!date) {
              return (
                <button
                  key={`m-blank-${idx}`}
                  type="button"
                  className="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10 dark:bg-gray-900/60 dark:text-gray-400"
                  disabled
                />
              )
            }
            const y = date.getUTCFullYear()
            const m = pad(date.getUTCMonth() + 1)
            const d = pad(date.getUTCDate())
            const key = `${y}-${m}-${d}`
            const list = events[key] ?? []
            const isCurrentMonth = date.getUTCMonth() + 1 === month
            const isToday = key === todayKey

            return (
              <button
                key={`m-${key}`}
                type="button"
                className={`flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10 ${
                  isCurrentMonth
                    ? "bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-900/60 dark:text-gray-400"
                } ${isToday ? "font-semibold text-indigo-600 dark:text-indigo-400" : ""}`}
                aria-label={key}
              >
                <time dateTime={key} className="ml-auto">
                  {parseInt(d, 10)}
                </time>
                <span className="sr-only">{list.length} events</span>
                {list.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {list.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: ev.color || "#9ca3af" }}
                      />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
