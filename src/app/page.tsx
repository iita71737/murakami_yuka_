import Link from "next/link";
import Image from "next/image";
import { fetchUserPhotoTweets } from "@/utils/x-api";

// Next.js 15 的新寫法，用於替代 getStaticProps
export const revalidate = 86400;

export default async function HomePage() {
  let tweets;
  try {
    tweets = await fetchUserPhotoTweets({ maxResults: 10 });
  } catch (e) {
    console.error("fetchUserPhotoTweets failed:", e);
    tweets = [];
  }

  return (
    <div className="container mx-auto px-4">
      <h1>Hello Next.js 👋</h1>

      <h2 style={{ marginTop: 24 }}>含圖片的最新貼文</h2>
      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 16 }}>
        {(tweets ?? []).map((t) => (
          <li key={t.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: 12 }}>{t.text}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {t.photos.map((p) => (
                <Image
                  key={p.url}
                  src={p.url}
                  alt={p.alt ?? "tweet image"}
                  width={80}
                  height={60}
                  style={{ height: "auto", borderRadius: 8 }}
                />
              ))}
            </div>
            <small style={{ color: "#64748b" }}>
              {t.created_at ? new Date(t.created_at).toLocaleString() : ""}
            </small>
          </li>
        ))}
        {(tweets ?? []).length === 0 && (
          <p style={{ color: "#64748b" }}>目前沒有可顯示的圖片貼文（或 API 速率已達上限）。</p>
        )}
      </ul>

      <p style={{ marginTop: 24 }}>
        <Link href="/about">About</Link>
      </p>
    </div>
  );
}