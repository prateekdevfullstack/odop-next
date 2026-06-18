import type { ChatMessage } from "@/lib/api/chat.types";

const SESSION_COOKIE = "odop_chat_browser_session";
const MESSAGES_KEY = "odop_chat_messages";

function hasSessionCookie(): boolean {
  return document.cookie
    .split(";")
    .some((entry) => entry.trim().startsWith(`${SESSION_COOKIE}=`));
}

function ensureSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`;
}

function loadStoredMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

/** Restore chat for the current browser session, or clear it after a full browser close. */
export function initChatSession(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [];
  }

  if (!hasSessionCookie()) {
    localStorage.removeItem(MESSAGES_KEY);
    ensureSessionCookie();
    return [];
  }

  return loadStoredMessages();
}

export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}
