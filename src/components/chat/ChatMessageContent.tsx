import React from "react";

const LINK_PATTERN =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<>"']+)/g;

function renderSegment(segment: string, key: number) {
  if (segment.startsWith("**") && segment.endsWith("**")) {
    return <strong key={key}>{segment.slice(2, -2)}</strong>;
  }

  const markdownLink = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (markdownLink) {
    return (
      <a
        key={key}
        href={markdownLink[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#8a231c] underline underline-offset-2 break-all hover:text-[#6b1b15]"
      >
        {markdownLink[1]}
      </a>
    );
  }

  if (/^https?:\/\//.test(segment)) {
    return (
      <a
        key={key}
        href={segment}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#8a231c] underline underline-offset-2 break-all hover:text-[#6b1b15]"
      >
        {segment}
      </a>
    );
  }

  return <React.Fragment key={key}>{segment}</React.Fragment>;
}

export default function ChatMessageContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIndex} className="h-1" aria-hidden />;
        }

        const parts = line.split(LINK_PATTERN).filter(Boolean);

        return (
          <p key={lineIndex} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {parts.map((part, partIndex) =>
              renderSegment(part, lineIndex * 1000 + partIndex)
            )}
          </p>
        );
      })}
    </div>
  );
}
