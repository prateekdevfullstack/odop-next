export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  relatedOptions?: string[];
}

export interface ChatSource {
  url: string;
  title: string;
}

export interface ChatAskPayload {
  question: string;
  conversationHistory: Pick<ChatMessage, "role" | "content">[];
  hindi?: boolean;
}

export type ChatStreamEvent =
  | { type: "token"; data: string }
  | { type: "sources"; data: ChatSource[] }
  | { type: "relatedOptions"; data: string[] }
  | { type: "done"; data?: string };
