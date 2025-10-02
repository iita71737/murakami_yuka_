"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"

const NAV_ITEMS = [
  { href: "/", label: "News" },
  { href: "/schedule", label: "Schedule" },
  { href: "/goods", label: "Goods" },
  { href: "/blog", label: "Blog" },
  { href: "/live", label: "Live" },
  { href: "/profile", label: "Profile" },
]

// 尺寸規格：統一控制
const ICON = "h-5 w-5 shrink-0"
const ICON_BTN = "h-10 w-10 p-2"
const LINK = "rounded-md px-3 py-2 text-sm leading-none font-medium transition-colors"

export default function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // 新增：登入狀態
  const [authLoading, setAuthLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onEsc)
    }
  }, [])

  // 讀 localStorage 的 JWT 並驗證
  useEffect(() => {
    const verify = async () => {
      try {
        const jwt = typeof window !== "undefined" ? localStorage.getItem("strapi_jwt") : null
        if (!jwt) {
          setIsAuthed(false)
          setUserName(null)
          return
        }
        const res = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        if (!res.ok) throw new Error(String(res.status))
        const me = await res.json()
        setIsAuthed(true)
        setUserName(me?.username ?? me?.email ?? "User")
      } catch {
        // 失效就清掉
        localStorage.removeItem("strapi_jwt")
        setIsAuthed(false)
        setUserName(null)
      } finally {
        setAuthLoading(false)
      }
    }
    verify()
  }, [])

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={[
          LINK,
          active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400",
        ].join(" ")}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    )
  }

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  // 登出：清 token 與狀態
  const logout = () => {
    localStorage.removeItem("strapi_jwt")
    setIsAuthed(false)
    setUserName(null)
    setUserOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* 左：Logo + 導覽 */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
              aria-label="Go to homepage"
            >
              Murakami Yuka
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((n) => (
                <NavLink key={n.href} href={n.href} label={n.label} />
              ))}
            </nav>
          </div>

          {/* 中：搜尋（md 以上顯示） */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <MagnifyingGlassIcon className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${ICON}`} />
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm leading-none text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* 右：通知、主題、CTA / 使用者選單、漢堡 */}
          <div className="flex items-center gap-2">
            {/* 通知 */}
            <button
              className={`relative inline-flex items-center justify-center rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50 ${ICON_BTN}`}
              aria-label="Notifications"
            >
              <BellIcon className={ICON} />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white leading-none">
                3
              </span>
            </button>

            {/* 主題切換 */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50 ${ICON_BTN}`}
              aria-label="Toggle dark mode"
            >
              {!mounted ? (
                <span className="block h-5 w-5 rounded bg-gray-300 dark:bg-gray-600" />
              ) : resolvedTheme === "dark" ? (
                <SunIcon className={ICON} />
              ) : (
                <MoonIcon className={ICON} />
              )}
            </button>

            {/* === 未登入：顯示 Login === */}
            {!authLoading && !isAuthed && (
              <>
                <Link
                  href={`${STRAPI_URL}/api/connect/google`}
                  className="hidden sm:inline-flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium px-3 py-2 hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                {/* 手機版 CTA */}
                <Link
                  href={`${STRAPI_URL}/api/connect/google`}
                  onClick={() => setMobileOpen(false)}
                  className="lg:hidden inline-flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium px-3 py-2 hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </>
            )}

            {/* === 已登入：顯示使用者選單 + Log out === */}
            {!authLoading && isAuthed && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <Image
                    src="https://avatar.iran.liara.run/public"
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="hidden sm:inline text-sm">{userName ?? "User"}</span>
                  <ChevronDownIcon className="h-4 w-4 opacity-70" />
                </button>

                {userOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
                  >
                    <Link
                      href="/profile"
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setUserOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setUserOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="my-1 border-t border-gray-200 dark:border-gray-800" />
                    <button
                      role="menuitem"
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={logout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 漢堡（手機/平板） */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`inline-flex lg:hidden items-center justify-center rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50 ${ICON_BTN}`}
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <XMarkIcon className={ICON} /> : <Bars3Icon className={ICON} />}
            </button>
          </div>
        </div>
      </div>

      {/* 手機選單（導覽） */}
      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-3">
            {/* 搜尋 */}
            <div className="relative">
              <MagnifyingGlassIcon className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${ICON}`} />
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm leading-none text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* 導覽 */}
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    LINK.replace("text-sm", "text-base").replace("font-medium", "font-normal"),
                    pathname === n.href
                      ? "bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                  ].join(" ")}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
