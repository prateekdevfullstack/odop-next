import { ENDPOINTS } from "@/lib/api";
import { ApiError } from "@/lib/api/types";
import type { ChatAskPayload, ChatStreamEvent } from "@/lib/api/chat.types";

export async function* streamChatAnswer(
  payload: ChatAskPayload,
  signal?: AbortSignal
): AsyncGenerator<ChatStreamEvent> {
  const response = await fetch(ENDPOINTS.chat.askStream, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(payload),
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError("Failed to generate response", response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError("No readable stream", 500);
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) {
          continue;
        }

        try {
          const parsed = JSON.parse(trimmed.slice(6)) as ChatStreamEvent;

          if (
            parsed.type === "sources" ||
            parsed.type === "token" ||
            parsed.type === "relatedOptions" ||
            parsed.type === "done"
          ) {
            yield parsed;
          }
        } catch {
          // Ignore malformed stream chunks.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
