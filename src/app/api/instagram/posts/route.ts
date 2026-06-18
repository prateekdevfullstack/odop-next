import { NextResponse } from "next/server";
import {
  fetchInstagramPost,
  UP_ODOP_INSTAGRAM_POST_URLS,
} from "@/lib/instagram-posts";

export const revalidate = 900;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlsParam = searchParams.get("urls");

  const urls = urlsParam
    ? urlsParam.split(",").map((url) => url.trim()).filter(Boolean)
    : [...UP_ODOP_INSTAGRAM_POST_URLS];

  const results = await Promise.all(urls.map((url) => fetchInstagramPost(url)));
  const posts = results.filter((post) => post !== null);

  return NextResponse.json({ posts });
}
