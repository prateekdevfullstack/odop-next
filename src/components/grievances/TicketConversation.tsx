"use client";

import { type ReactNode, useMemo } from "react";
import { formatTicketDate } from "@/lib/grievance-ticket";
import {
  buildTicketConversationMessages,
  type BuildTicketConversationInput,
} from "@/lib/ticket-conversation";

type TicketConversationProps = BuildTicketConversationInput & {
  title?: string;
  loading?: boolean;
  footer?: ReactNode;
};

export function TicketConversation({
  title = "Conversation",
  loading = false,
  footer,
  initialMessage,
  createdAt,
  fullName,
  assignedAdminName,
  activityLog,
}: TicketConversationProps) {
  const messages = useMemo(
    () =>
      buildTicketConversationMessages({
        initialMessage,
        createdAt,
        fullName,
        assignedAdminName,
        activityLog,
      }),
    [initialMessage, createdAt, fullName, assignedAdminName, activityLog]
  );

  if (loading) {
    return (
      <section className="panel ticket-conversation-panel">
        <h2>{title}</h2>
        <p className="ticket-conversation-empty">Loading messages…</p>
      </section>
    );
  }

  return (
    <section className="panel ticket-conversation-panel">
      <h2>{title}</h2>
      {messages.length === 0 ? (
        <p className="ticket-conversation-empty">No messages yet.</p>
      ) : (
        <div className="ticket-conversation" aria-label="Ticket conversation">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ticket-conversation-message ticket-conversation-message--${message.sender}`}
            >
              <div className="ticket-conversation-bubble">{message.text}</div>
              <p className="ticket-conversation-meta">
                <strong>{message.senderLabel}</strong>
                <span> · {formatTicketDate(message.createdAt)}</span>
              </p>
            </div>
          ))}
        </div>
      )}
      {footer ? <div className="ticket-conversation-footer">{footer}</div> : null}
    </section>
  );
}