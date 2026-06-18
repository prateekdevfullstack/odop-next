"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SyndicationTweet } from "@/lib/x-syndication";
import { UP_ODOP_TWEET_IDS, UP_ODOP_X_PROFILE_URL } from "@/lib/x-syndication";

export type TwitterTimelineWidgetProps = {
  profileUrl?: string;
  tweetIds?: readonly string[];
  className?: string;
};

function formatTweetDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function truncateTweetText(text: string, max = 220): string {
  const normalized = text.replace(/https:\/\/t\.co\/\S+/g, "").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

function TweetCard({ tweet }: { tweet: SyndicationTweet }) {
  return (
    <a
      href={tweet.tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="sms-x-post"
    >
      <div className="sms-x-post__head">
        {tweet.user.avatarUrl ? (
          <Image
            src={tweet.user.avatarUrl}
            alt=""
            width={36}
            height={36}
            className="sms-x-post__avatar"
            unoptimized
          />
        ) : (
          <span className="sms-x-post__avatar sms-x-post__avatar--placeholder" aria-hidden />
        )}
        <div className="sms-x-post__meta">
          <span className="sms-x-post__name">{tweet.user.name}</span>
          <span className="sms-x-post__handle">@{tweet.user.screenName}</span>
        </div>
        <time className="sms-x-post__date" dateTime={tweet.createdAt}>
          {formatTweetDate(tweet.createdAt)}
        </time>
      </div>
      <p className="sms-x-post__text">{truncateTweetText(tweet.text)}</p>
      {tweet.mediaUrl && (
        <div className="sms-x-post__media">
          <Image
            src={tweet.mediaUrl}
            alt=""
            width={520}
            height={280}
            className="sms-x-post__img"
            unoptimized
          />
        </div>
      )}
    </a>
  );
}

/** @UP_ODOP posts feed — fetches tweet data server-side (no widgets.js). */
export default function TwitterTimelineWidget({
  profileUrl = UP_ODOP_X_PROFILE_URL,
  tweetIds = UP_ODOP_TWEET_IDS,
  className = "sms-embed sms-embed--widget sms-embed--x",
}: TwitterTimelineWidgetProps) {
  const [tweets, setTweets] = useState<SyndicationTweet[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      try {
        const ids = tweetIds.join(",");
        const response = await fetch(`/api/x/tweets?ids=${encodeURIComponent(ids)}`);
        if (!response.ok) throw new Error("fetch failed");
        const data = (await response.json()) as { tweets: SyndicationTweet[] };
        if (cancelled) return;
        setTweets(data.tweets ?? []);
        setStatus(data.tweets?.length ? "ready" : "error");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [tweetIds]);

  return (
    <div className={className} aria-label="Posts by UP_ODOP on X">
      {status === "loading" && (
        <p className="sms-x-feed-status">Loading posts…</p>
      )}

      {status === "error" && (
        <p className="sms-x-feed-status">
          Posts could not load.{" "}
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            View on X
          </a>
        </p>
      )}

      {status === "ready" && (
        <div className="sms-x-feed">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sms-x-feed__more"
          >
            View all posts on X →
          </a>
        </div>
      )}

      <style>{`
        .sms-x-feed {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 360px;
          overflow-y: auto;
          padding: 4px 2px 8px;
        }
        .sms-x-feed-status {
          margin: 0;
          padding: 24px 12px;
          text-align: center;
          font-family: "Poppins", sans-serif;
          font-size: 0.85rem;
          color: #6b7280;
        }
        .sms-x-feed-status a,
        .sms-x-feed__more {
          color: #1d9bf0;
          font-weight: 600;
          text-decoration: none;
        }
        .sms-x-feed-status a:hover,
        .sms-x-feed__more:hover {
          text-decoration: underline;
        }
        .sms-x-feed__more {
          display: block;
          text-align: center;
          font-family: "Poppins", sans-serif;
          font-size: 0.8rem;
          padding-top: 4px;
        }
        .sms-x-post {
          display: block;
          padding: 10px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 10px;
          background: #fff;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .sms-x-post:hover {
          border-color: rgba(29, 155, 240, 0.35);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }
        .sms-x-post__head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .sms-x-post__avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .sms-x-post__avatar--placeholder {
          display: inline-block;
          background: #e5e7eb;
        }
        .sms-x-post__meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .sms-x-post__name {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sms-x-post__handle {
          font-size: 0.75rem;
          color: #6b7280;
        }
        .sms-x-post__date {
          flex-shrink: 0;
          font-size: 0.72rem;
          color: #9ca3af;
        }
        .sms-x-post__text {
          margin: 0 0 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.82rem;
          line-height: 1.45;
          color: #1f2937;
          white-space: pre-wrap;
        }
        .sms-x-post__media {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .sms-x-post__img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 180px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
