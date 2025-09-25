// src/components/Footer.tsx
"use client"

import Link from "next/link"

const LINKS = [
  { href: "/privacy", label: "個人情報の取り扱いについて" },
  { href: "/terms", label: "利用規約" },
  { href: "/faq", label: "FAQ/お問い合わせ" },
  { href: "/guide", label: "有料サービスガイドライン" },
  { href: "/legal", label: "特定商取引法に基づく表記" },
]

function IconWrap({
  children, href, label,
}: { children: React.ReactNode; href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={[
        // 將 currentColor 綁到 Tailwind 的文本色，跟著 dark 模式走
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "text-slate-600 dark:text-slate-200",              // ← 這行決定 SVG 的 currentColor（亮=slate-600 / 暗=slate-200）
        "bg-white/90 dark:bg-white/10",                    // 底色也跟著暗色調柔和一點
        "hover:bg-white dark:hover:bg-white/20",           // hover 狀態
        "transition-colors shadow-sm",
      ].join(" ")}
    >
      {/* 內部 SVG 保持 fill='currentColor' 或 stroke='currentColor' */}
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#c9def3] dark:bg-[#2a3b52]">
      {/* 右上社群 */}
      <div className="absolute right-4 top-4 flex gap-3 sm:gap-4">
        <IconWrap href="https://youtube.com" label="YouTube">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M21.8 8.001a3 3 0 0 0-2.11-2.12C18.34 5.5 12 5.5 12 5.5s-6.34 0-7.69.38A3 3 0 0 0 2.2 8.001 31.5 31.5 0 0 0 1.8 12a31.5 31.5 0 0 0 .38 3.999 3 3 0 0 0 2.11 2.12C5.66 18.5 12 18.5 12 18.5s6.34 0 7.69-.381a3 3 0 0 0 2.11-2.12c.252-1.317.38-2.666.38-3.999s-.128-2.682-.38-3.999ZM10.5 15V9l5 3-5 3Z"/>
          </svg>
        </IconWrap>
        <IconWrap href="https://www.tiktok.com" label="TikTok">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M21 7.5a7.5 7.5 0 0 1-4.5-1.5v7.086a6.086 6.086 0 1 1-6.086-6.086c.31 0 .612.03.906.086V9.6A3.91 3.91 0 1 0 9.5 16.41 3.91 3.91 0 0 0 13.41 12.5V2h2.1A5.4 5.4 0 0 0 21 4.9v2.6Z"/>
          </svg>
        </IconWrap>
        <IconWrap href="https://instagram.com" label="Instagram">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="17.5" cy="6.5" r="1"></circle>
          </svg>
        </IconWrap>
        <IconWrap href="https://x.com" label="X (Twitter)">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-4.78-6.21L4.8 22H2l7.03-8.03L2 2h6.914l4.46 5.86L18.244 2Zm-2.4 18h1.33L8.22 4H6.82l9.024 16Z"/>
          </svg>
        </IconWrap>
      </div>

      {/* 主要區：置中 Logo；增加底部 padding 以避開左下連結 */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-28 sm:pb-32 lg:pb-36">
        <div className="flex items-center justify-center">
          <div className="text-white/95 dark:text-white text-4xl sm:text-5xl font-semibold tracking-[0.15em]">
            murakami_yuka
            <span className="ml-2 align-super text-sm font-normal tracking-normal">official みるんくらぶ</span>
          </div>
        </div>
      </div>

      {/* 左下角連結：抽出容器，固定在視窗左下 */}
      <div className="absolute left-4 right-4 bottom-4">
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-white/90 dark:text-white/80">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:underline decoration-white/70 underline-offset-4"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
