import { NextResponse } from "next/server";
import {
  fetchSyndicationTweet,
  UP_ODOP_TWEET_IDS,
} from "@/lib/x-syndication";

export const revalidate = 900;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  const ids = idsParam
    ? idsParam.split(",").map((id) => id.trim()).filter(Boolean)
    : [...UP_ODOP_TWEET_IDS];

  const results = await Promise.all(ids.map((id) => fetchSyndicationTweet(id)));
  const tweets = results.filter((tweet) => tweet !== null);

  return NextResponse.json({ tweets });
}
