import { NextRequest, NextResponse } from "next/server";
import { DJANGO_PATHS, forwardToDjango, placeholderText } from "@/lib/django-client";
// Phase 4: restore Gemini
// import { GoogleGenAI } from "@google/genai";
// import { CCA_SYSTEM_PROMPT } from "@/lib/ai-client";
//
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages?.length) {
      return NextResponse.json(
        { error: "Messages required" },
        { status: 400 }
      );
    }

    const django = await forwardToDjango(DJANGO_PATHS.chat, { messages });
    const text = placeholderText(django);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

    // Phase 4: restore Gemini streaming
    // const conversation = messages
    //   .slice(-20)
    //   .map((m: { role: string; content: string }) => {
    //     const role = m.role === "assistant" ? "model" : "user";
    //     return `${role}: ${m.content}`;
    //   })
    //   .join("\n\n");
    //
    // const prompt = `
    // ${CCA_SYSTEM_PROMPT}
    //
    // Conversation:
    // ${conversation}
    // `;
    //
    // const stream = await ai.models.generateContentStream({
    //   model: process.env.AI_MODEL || "gemini-2.5-flash",
    //   contents: prompt,
    // });
    //
    // const readable = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       for await (const chunk of stream) {
    //         const chunkText = chunk.text;
    //         if (chunkText) {
    //           controller.enqueue(
    //             encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`)
    //           );
    //         }
    //       }
    //       controller.enqueue(encoder.encode("data: [DONE]\n\n"));
    //       controller.close();
    //     } catch (error) {
    //       console.error(error);
    //       controller.error(error);
    //     }
    //   },
    // });
    //
    // return new Response(readable, {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   },
    // });
  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
