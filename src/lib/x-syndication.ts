export const UP_ODOP_X_PROFILE_URL = "https://x.com/UP_ODOP";

/** Recent @UP_ODOP post IDs — add new IDs from x.com/UP_ODOP as they are published. */
export const UP_ODOP_TWEET_IDS = [
  "2061690491687891262",
] as const;

export type SyndicationTweet = {
  id: string;
  text: string;
  createdAt: string;
  favoriteCount: number;
  user: {
    name: string;
    screenName: string;
    avatarUrl: string;
  };
  mediaUrl: string | null;
  tweetUrl: string;
};

type SyndicationApiTweet = {
  id_str?: string;
  text?: string;
  created_at?: string;
  favorite_count?: number;
  user?: {
    name?: string;
    screen_name?: string;
    profile_image_url_https?: string;
  };
  photos?: { url?: string }[];
  mediaDetails?: { media_url_https?: string; type?: string }[];
};

export function getSyndicationToken(tweetId: string): string {
  return ((Number(tweetId) / 1e15) * Math.PI)
    .toString()
    .replace(/(0+|\.)/g, "");
}

export async function fetchSyndicationTweet(tweetId: string): Promise<SyndicationTweet | null> {
  const id = tweetId.trim();
  if (!/^\d+$/.test(id)) return null;

  const url = new URL("https://cdn.syndication.twimg.com/tweet-result");
  url.searchParams.set("id", id);
  url.searchParams.set("token", getSyndicationToken(id));
  url.searchParams.set("lang", "en");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as SyndicationApiTweet;
  const screenName = data.user?.screen_name ?? "UP_ODOP";
  const photo =
    data.photos?.[0]?.url ??
    data.mediaDetails?.find((m) => m.type === "photo")?.media_url_https ??
    null;

  return {
    id,
    text: data.text ?? "",
    createdAt: data.created_at ?? new Date().toISOString(),
    favoriteCount: data.favorite_count ?? 0,
    user: {
      name: data.user?.name ?? "UP_ODOP",
      screenName,
      avatarUrl: data.user?.profile_image_url_https ?? "",
    },
    mediaUrl: photo,
    tweetUrl: `https://x.com/${screenName}/status/${id}`,
  };
}
