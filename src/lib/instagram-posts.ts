export const UP_ODOP_INSTAGRAM_PROFILE_URL = "https://www.instagram.com/up_odop/";

/** Public post/reel permalinks — add new URLs from instagram.com/up_odop as they are published. */
export const UP_ODOP_INSTAGRAM_POST_URLS = [
  "https://www.instagram.com/odop_mart/reel/DHXqL52Kv3Q/",
] as const;

const INSTAGRAM_FETCH_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

export type InstagramPost = {
  id: string;
  caption: string;
  thumbnailUrl: string;
  postUrl: string;
  author: {
    name: string;
    handle: string;
    profileUrl: string;
  };
};

export function getInstagramPostId(postUrl: string): string {
  const match = postUrl.match(
    /instagram\.com\/(?:[\w.]+\/)?(?:p|reel|tv)\/([^/?#]+)/i,
  );
  return match?.[1] ?? postUrl;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#064;/g, "@")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readMetaContent(html: string, property: string): string {
  const match = html.match(
    new RegExp(`property="${property}" content="([^"]+)"`, "i"),
  );
  return match?.[1] ? decodeHtmlEntities(match[1]) : "";
}

function parseAuthorFromDescription(description: string): {
  handle: string;
  profileUrl: string;
} {
  const match = description.match(
    /(?:\d[\d,]* likes,? )?(?:\d[\d,]* comments? - )?@?([\w.]+) on /i,
  );
  const handle = match?.[1] ?? "up_odop";
  return {
    handle,
    profileUrl: `https://www.instagram.com/${handle}/`,
  };
}

function parseCaption(ogTitle: string, ogDescription: string): string {
  const fromTitle = ogTitle.split(" on Instagram:")[1]?.trim();
  if (fromTitle) {
    return fromTitle.replace(/^["']|["']\.?$/g, "").trim();
  }

  const fromDescription = ogDescription
    .replace(
      /^(?:\d[\d,]* likes,? )?(?:\d[\d,]* comments? - )?@?[\w.]+ on [^:]+:\s*/i,
      "",
    )
    .replace(/^["']|["']\.?$/g, "")
    .trim();

  return fromDescription;
}

export async function fetchInstagramPost(
  postUrl: string,
): Promise<InstagramPost | null> {
  const normalized = postUrl.trim().replace(/\/?$/, "/");
  if (!normalized.includes("instagram.com")) return null;

  try {
    const response = await fetch(normalized, {
      headers: {
        "User-Agent": INSTAGRAM_FETCH_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const thumbnailUrl = readMetaContent(html, "og:image");
    if (!thumbnailUrl) return null;

    const ogTitle = readMetaContent(html, "og:title");
    const ogDescription = readMetaContent(html, "og:description");
    const ogUrl = readMetaContent(html, "og:url") || normalized;
    const { handle, profileUrl } = parseAuthorFromDescription(ogDescription);
    const authorName = ogTitle.split(" on Instagram:")[0]?.trim() || handle;

    return {
      id: getInstagramPostId(ogUrl),
      caption: parseCaption(ogTitle, ogDescription),
      thumbnailUrl,
      postUrl: ogUrl,
      author: {
        name: authorName,
        handle,
        profileUrl,
      },
    };
  } catch {
    return null;
  }
}
