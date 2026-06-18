"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { InstagramPost } from "@/lib/instagram-posts";
import {
  UP_ODOP_INSTAGRAM_POST_URLS,
  UP_ODOP_INSTAGRAM_PROFILE_URL,
} from "@/lib/instagram-posts";

export type InstagramTimelineWidgetProps = {
  profileUrl?: string;
  postUrls?: readonly string[];
  className?: string;
};

function truncateCaption(text: string, max = 180): string {
  const normalized = text.trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

function PostCard({ post }: { post: InstagramPost }) {
  return (
    <a
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="sms-ig-post"
    >
      {post.thumbnailUrl ? (
        <div className="sms-ig-post__media">
          <Image
            src={post.thumbnailUrl}
            alt=""
            width={640}
            height={640}
            className="sms-ig-post__img"
            unoptimized
          />
        </div>
      ) : null}
      <div className="sms-ig-post__body">
        <div className="sms-ig-post__head">
          <span className="sms-ig-post__name">{post.author.name}</span>
          <span className="sms-ig-post__handle">@{post.author.handle}</span>
        </div>
        {post.caption ? (
          <p className="sms-ig-post__caption">{truncateCaption(post.caption)}</p>
        ) : null}
      </div>
    </a>
  );
}

/** UP_ODOP Instagram feed — server-fetched previews (no embed.js / iframes). */
export default function InstagramTimelineWidget({
  profileUrl = UP_ODOP_INSTAGRAM_PROFILE_URL,
  postUrls = UP_ODOP_INSTAGRAM_POST_URLS,
  className = "sms-embed sms-embed--widget sms-embed--instagram",
}: InstagramTimelineWidgetProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      try {
        const urls = postUrls.join(",");
        const response = await fetch(
          `/api/instagram/posts?urls=${encodeURIComponent(urls)}`,
        );
        if (!response.ok) throw new Error("fetch failed");
        const data = (await response.json()) as { posts: InstagramPost[] };
        if (cancelled) return;
        setPosts(data.posts ?? []);
        setStatus(data.posts?.length ? "ready" : "error");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [postUrls]);

  return (
    <div className={className} aria-label="Posts by UP_ODOP on Instagram">
      {status === "loading" && (
        <p className="sms-ig-feed-status">Loading posts…</p>
      )}

      {status === "error" && (
        <p className="sms-ig-feed-status">
          Posts could not load.{" "}
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            View on Instagram
          </a>
        </p>
      )}

      {status === "ready" && (
        <div className="sms-ig-feed">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sms-ig-feed__more"
          >
            View all posts on Instagram →
          </a>
        </div>
      )}

      <style>{`
        .sms-ig-feed {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 360px;
          overflow-y: auto;
          padding: 4px 2px 8px;
        }
        .sms-ig-feed-status {
          margin: 0;
          padding: 24px 12px;
          text-align: center;
          font-family: "Poppins", sans-serif;
          font-size: 0.85rem;
          color: #6b7280;
        }
        .sms-ig-feed-status a,
        .sms-ig-feed__more {
          color: #c13584;
          font-weight: 600;
          text-decoration: none;
        }
        .sms-ig-feed-status a:hover,
        .sms-ig-feed__more:hover {
          text-decoration: underline;
        }
        .sms-ig-feed__more {
          display: block;
          text-align: center;
          font-family: "Poppins", sans-serif;
          font-size: 0.8rem;
          padding-top: 4px;
        }
        .sms-ig-post {
          display: block;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 10px;
          background: #fff;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .sms-ig-post:hover {
          border-color: rgba(193, 53, 132, 0.4);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }
        .sms-ig-post__media {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          max-height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }
        .sms-ig-post__img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sms-ig-post__body {
          padding: 10px;
        }
        .sms-ig-post__head {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-bottom: 6px;
        }
        .sms-ig-post__name {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sms-ig-post__handle {
          font-size: 0.75rem;
          color: #6b7280;
        }
        .sms-ig-post__caption {
          margin: 0;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.8rem;
          line-height: 1.45;
          color: #1f2937;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}
