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
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline"

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

// 統一尺寸常數（可改成你要的刻度）
const ICON_BTN = "h-10 w-10 p-2"          // 40x40 的 icon button
const ICON_20 = "h-5 w-5 shrink-0"         // 20px 的 SVG
const LINK_BASE = "rounded-md px-3 py-2 text-sm leading-none font-medium transition-colors"

export default function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifCount] = useState(3) // demo

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("keydown", onEsc)
    }
  }, [])

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark")

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={[
          LINK_BASE,
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

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* 左：Logo + Desktop Nav */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
              aria-label="Go to homepage"
            >
              Logo
            </Link>
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              {NAV_ITEMS.map((n) => (
                <NavLink key={n.href} href={n.href} label={n.label} />
              ))}
            </nav>
          </div>

          {/* 中：搜尋（md 以上可見） */}
          <div className="hidden md:flex flex-1 max-w-xl items-center">
            <div className="relative w-full">
              <MagnifyingGlassIcon className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${ICON_20}`} />
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm leading-none text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* 右：鈴鐺 / 主題切換 / Avatar 下拉 / 漢堡 */}
          <div className="flex items-center gap-1">
            {/* 通知 */}
            <button
              className={`relative inline-flex items-center justify-center rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50 ${ICON_BTN}`}
              aria-label="Notifications"
            >
              <BellIcon className={ICON_20} />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white leading-none">
                  {notifCount}
                </span>
              )}
            </button>

            {/* 主題切換 */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50 ${ICON_BTN}`}
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className={ICON_20} />
              ) : (
                <MoonIcon className={ICON_20} />
              )}
            </button>

            {/* Avatar 下拉（desktop） */}
            <UserMenu
              open={menuOpen}
              setOpen={setMenuOpen}
              menuRef={menuRef}
            />

            {/* 漢堡（mobile） */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`inline-flex lg:hidden items-center justify-center rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50 ${ICON_BTN}`}
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <XMarkIcon className={ICON_20} />
              ) : (
                <Bars3Icon className={ICON_20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 手機選單 */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </header>
  )
}

function UserMenu({
  open,
  setOpen,
  menuRef,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  menuRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div className="relative hidden lg:block" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src="https://via.placeholder.com/80"
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-70" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
        >
          <Link
            href="#"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2 text-sm leading-none text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            <UserCircleIcon className="h-4 w-4 shrink-0" />
            Profile
          </Link>
          <Link
            href="#"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2 text-sm leading-none text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            <Cog6ToothIcon className="h-4 w-4 shrink-0" />
            Settings
          </Link>
          <div className="my-1 border-t border-gray-200 dark:border-gray-800" />
          <button
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm leading-none text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean
  onClose: () => void
  pathname: string | null
}) {
  if (!open) return null
  return (
    <div id="mobile-menu" className="lg:hidden border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* 搜尋（mobile） */}
        <div className="mb-3">
          <div className="relative w-full">
            <MagnifyingGlassIcon className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${ICON_20}`} />
            <input
              type="search"
              placeholder="Search…"
              className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm leading-none text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* 連結 */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={onClose}
              className={[
                LINK_BASE.replace("font-medium", "font-normal").replace("text-sm", "text-base"),
                pathname === n.href
                  ? "bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              {n.label}
            </Link>
          ))}

          {/* 使用者選單（簡化版） */}
          <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
            <Link
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <UserCircleIcon className={ICON_20} />
              Profile
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <Cog6ToothIcon className={ICON_20} />
              Settings
            </Link>
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <ArrowRightStartOnRectangleIcon className={ICON_20} />
              Sign out
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
