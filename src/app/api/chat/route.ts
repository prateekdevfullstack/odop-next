import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nestResponse = await fetch(ENDPOINTS.chat.backendAskStream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(body),
    });

    if (!nestResponse.ok) {
      return NextResponse.json(
        { error: "Failed to connect to chatbot backend" },
        { status: nestResponse.status }
      );
    }

    if (!nestResponse.body) {
      return NextResponse.json(
        { error: "No stream received from backend" },
        { status: 500 }
      );
    }

    return new NextResponse(nestResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[/api/chat] proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to reach chatbot backend", details: message },
      { status: 502 }
    );
  }
}
