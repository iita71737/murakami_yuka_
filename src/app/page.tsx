import Link from "next/link";
import { fetchUserPhotoTweets } from "@/utils/x-api";
import { TweetList } from "@/components/tweets/tweet-list";

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
      <TweetList tweets={tweets ?? []} />

      <p className="mt-6">
        <Link href="/about">About</Link>
      </p>
    </div>
  );
}