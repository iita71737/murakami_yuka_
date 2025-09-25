import Image from "next/image";
import { type Tweet } from "@/utils/x-api";

interface TweetListProps {
  tweets: Tweet[];
}

export function TweetList({ tweets }: TweetListProps) {
  if (tweets.length === 0) {
    return (
      <p className="text-slate-400 text-center mt-8 italic tracking-wide">
        目前沒有可顯示的圖片貼文（或 API 速率已達上限）。
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 list-none p-0">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </ul>
  );
}

interface TweetCardProps {
  tweet: Tweet;
}

function TweetCard({ tweet }: TweetCardProps) {
  const photos = tweet.photos ?? [];
  const first = photos[0];

  // 用固定格式避免 SSR/CSR locale 差異
  const dateText =
    tweet.created_at
      ? new Date(tweet.created_at).toISOString().slice(0, 16).replace("T", " ")
      : "";

  return (
    <li className="relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 pb-10 pr-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* 左圖：固定寬度、4:3，整體垂直置中 */}
        {first ? (
          <div className="relative shrink-0 w-full md:w-48 self-center md:self-auto rounded-xl overflow-hidden">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={first.url}
                alt={first.alt ?? "tweet image"}
                fill
                sizes="(min-width:1280px) 12rem, (min-width:768px) 12rem, 100vw"
                className="object-cover"
                priority={false}
              />
              {photos.length > 1 && (
                <span className="absolute right-2 top-2 rounded-md bg-black/60 text-white text-xs px-1.5 py-0.5">
                  +{photos.length - 1}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="shrink-0 w-full md:w-48 rounded-xl bg-slate-100 dark:bg-neutral-800 aspect-[4/3] self-center md:self-auto" />
        )}

        {/* 右文：高度對齊圖片，高度內做行數限制 */}
        <div className="min-w-0 flex-1 md:h-36 flex flex-col">
          <p className="whitespace-pre-wrap text-[15px] leading-6 text-slate-800 dark:text-slate-200 tracking-wide font-[Noto_Sans_JP] line-clamp-5">
            {tweet.text}
          </p>
          {/* 這個 spacer 讓文字頂到上緣，底部留空給右下日期 */}
          <div className="mt-2 md:mt-auto" />
        </div>
      </div>

      {/* 右下角日期（固定在卡片角落） */}
      <time
        className="absolute right-4 bottom-3 text-slate-400 text-xs md:text-sm font-light"
        dateTime={tweet.created_at ?? undefined}
        title={tweet.created_at ?? undefined}
      >
        {dateText}
      </time>
    </li>
  );
}
