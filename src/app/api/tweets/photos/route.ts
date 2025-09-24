import { NextRequest, NextResponse } from "next/server";
import { fetchUserPhotoTweets } from "@/utils/x-api";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const maxResults = searchParams.get("max_results");
    
    const out = await fetchUserPhotoTweets({
      userId: userId ?? undefined,
      maxResults: maxResults ? Number(maxResults) : 10,
      revalidate: 60,
    });
    
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}