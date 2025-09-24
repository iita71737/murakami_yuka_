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
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
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
  return (
    <li className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="whitespace-pre-wrap mb-4 text-slate-800 dark:text-slate-200 leading-relaxed tracking-wide font-[Noto_Sans_JP]">
        {tweet.text}
      </p>

      <div className="flex gap-3 flex-wrap mb-3">
        {tweet.photos.map((photo) => (
          <div key={photo.url} className="relative w-32 h-24 overflow-hidden rounded-lg">
            <Image
              src={photo.url}
              alt={photo.alt ?? "tweet image"}
              fill
              className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="text-right">
        <small className="text-slate-400 text-sm font-light">
          {tweet.created_at ? new Date(tweet.created_at).toLocaleDateString("ja-JP", { 
            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
          }) : ""}
        </small>
      </div>
    </li>
  );
}
