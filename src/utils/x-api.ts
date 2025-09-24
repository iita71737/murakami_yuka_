// utils/x-api.ts
import fs from "fs";
import path from "path";

type PhotoItem = {
  url: string;
  width?: number;
  height?: number;
  alt: string | null;
};

type TimelineItem = {
  id: string;
  text: string;
  created_at?: string;
  photos: PhotoItem[];
  flags: { isRetweet: boolean; isQuote: boolean; isPinned: boolean };
};

const CACHE_FILE = path.join(process.cwd(), ".cache_tweets.json");

export async function fetchUserPhotoTweets({
  userId = process.env.X_USER_ID!,
  maxResults = 20,       // 最多回傳幾筆（過濾後再裁切）
  monthsBack = 1,        // 近一個月
  useCache = true,       // 若限流則回傳快取
}: {
  userId?: string;
  maxResults?: number;
  monthsBack?: number;
  useCache?: boolean;
} = {}): Promise<TimelineItem[]> {
  const base = process.env.X_API_BASE || "https://api.twitter.com/2";
  const headers = { Authorization: `Bearer ${process.env.X_BEARER_TOKEN}` };

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - monthsBack);
  const cutoffTS = cutoff.getTime();
  const startTimeISO = new Date(cutoffTS).toISOString();

  const loadCache = (): TimelineItem[] | null => {
    if (useCache && fs.existsSync(CACHE_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      } catch {}
    }
    return null;
  };
  const saveCache = (data: TimelineItem[]) => {
    if (useCache) {
      try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
      } catch {}
    }
  };

  const collected: TimelineItem[] = [];

  // ---------- 1) Pinned：用 users 端點一次取 user + pinned tweet + media ----------
  try {
    const pinnedQS = new URLSearchParams({
      expansions: "pinned_tweet_id,attachments.media_keys",
      "tweet.fields": "created_at,attachments,text,referenced_tweets",
      "media.fields": "url,width,height,alt_text,type,preview_image_url",
    });
    const userRes = await fetch(`${base}/users/${userId}?${pinnedQS}`, { headers });

    if (userRes.status === 429) {
      console.warn("X API rate-limited (pinned). Returning cache if available.");
      const cache = loadCache();
      if (cache) return cache.slice(0, maxResults);
    } else if (userRes.ok) {
      const uj = await userRes.json();
      const pinnedId: string | undefined = uj?.data?.pinned_tweet_id;
      const incTweets: any[] = uj?.includes?.tweets ?? [];
      const incMedia: any[] = uj?.includes?.media ?? [];
      const mediaMap = new Map(incMedia.map((m: any) => [m.media_key, m]));
      const pinned = incTweets.find((t) => t.id === pinnedId);

      if (pinned) {
        const ts = pinned.created_at ? Date.parse(pinned.created_at) : 0;
        if (ts >= cutoffTS) {
          const photos: PhotoItem[] =
            (pinned.attachments?.media_keys ?? [])
              .map((k: string) => mediaMap.get(k))
              .filter((m: any) => m && m.type === "photo" && m.url)
              .map((p: any) => ({
                url: p.url!,
                width: p.width,
                height: p.height,
                alt: p.alt_text ?? null,
              }));

          if (photos.length) {
            collected.push({
              id: pinned.id,
              text: pinned.text,
              created_at: pinned.created_at,
              photos,
              flags: { isRetweet: false, isQuote: false, isPinned: true },
            });
          }
        }
      }
    } else {
      const body = await userRes.text().catch(() => "");
      console.warn(`Pinned fetch failed ${userRes.status}: ${body}`);
    }
  } catch (e) {
    console.warn("Pinned fetch error:", e);
  }

  // ---------- 2) Timeline：一天只打一頁，max_results=100，帶 start_time，排除回覆 ----------
  try {
    const tlQS = new URLSearchParams({
      max_results: "100", // 單頁最多 100
      exclude: "replies",
      "start_time": startTimeISO,
      expansions: "attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id",
      "tweet.fields": "created_at,attachments,referenced_tweets,text",
      "media.fields": "url,width,height,alt_text,type",
    });

    const tlRes = await fetch(`${base}/users/${userId}/tweets?${tlQS}`, { headers });

    if (tlRes.status === 429) {
      console.warn("X API rate-limited (timeline). Returning cache if available.");
      const cache = loadCache();
      if (cache) return cache.slice(0, maxResults);
    } else if (!tlRes.ok) {
      const body = await tlRes.text().catch(() => "");
      throw new Error(`X API ${tlRes.status}: ${body}`);
    } else {
      const tj = await tlRes.json();
      const mediaByKey = new Map((tj.includes?.media ?? []).map((m: any) => [m.media_key, m]));
      const refTweetsById = new Map((tj.includes?.tweets ?? []).map((t: any) => [t.id, t]));

      const batch: TimelineItem[] = (tj.data ?? [])
        .map((outer: any) => {
          // retweet/quote → 以原文內容為基礎，但保留外層 created_at
          let base = outer;
          let isRetweet = false;
          let isQuote = false;
          const ref = outer.referenced_tweets?.find(
            (r: any) => r.type === "retweeted" || r.type === "quoted"
          );
          if (ref) {
            const orig = refTweetsById.get(ref.id);
            if (orig) {
              base = orig;
              isRetweet = ref.type === "retweeted";
              isQuote = ref.type === "quoted";
            }
          }

          const ts = outer.created_at ? Date.parse(outer.created_at) : 0;
          if (ts < cutoffTS) return null;

          const photos: PhotoItem[] =
            (base.attachments?.media_keys ?? [])
              .map((k: string) => mediaByKey.get(k))
              .filter((m: any) => m && m.type === "photo" && m.url)
              .map((p: any) => ({
                url: p.url!,
                width: p.width,
                height: p.height,
                alt: p.alt_text ?? null,
              }));

          if (!photos.length) return null;

          return {
            id: outer.id,
            text: base.text,
            created_at: outer.created_at ?? base.created_at,
            photos,
            flags: { isRetweet, isQuote, isPinned: false },
          } as TimelineItem;
        })
        .filter(Boolean) as TimelineItem[];

      // 合併，並先移除與 pinned 重複的 id
      const pinnedId = collected.find((x) => x.flags.isPinned)?.id;
      const merged = [
        ...collected,
        ...batch.filter((b) => (pinnedId ? b.id !== pinnedId : true)),
      ];

      // 排序（新→舊），確保 pinned 永遠第一個
      merged.sort((a, b) => Date.parse(b.created_at ?? "0") - Date.parse(a.created_at ?? "0"));
      merged.sort((a, b) => (a.flags.isPinned === b.flags.isPinned ? 0 : a.flags.isPinned ? -1 : 1));

      // 去重
      const seen = new Set<string>();
      const deduped = merged.filter((t) => !seen.has(t.id) && seen.add(t.id));

      // 存快取
      saveCache(deduped);

      return deduped.slice(0, maxResults);
    }
  } catch (e) {
    console.warn("Timeline fetch error:", e);
  }

  // 走到這裡代表 timeline 沒抓到；回傳（可能只有 pinned 的）已收集 or 快取
  const cache = loadCache();
  if (cache?.length) {
    // 確保 pinned 仍在最前
    cache.sort((a, b) => (a.flags.isPinned === b.flags.isPinned ? 0 : a.flags.isPinned ? -1 : 1));
    return cache.slice(0, maxResults);
  }
  return collected.slice(0, maxResults);
}
