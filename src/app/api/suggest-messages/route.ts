import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText, StreamData } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();
    const prompts =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seprated by '||'. these questions are for an anonymous social messaging plateform, like Qooh.me and should suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For 'ehat' a hobby you've recently started? || If you could have dinner with any historical figure,whi would it be? || questions are intriguing, faster curiosity, and contribute to a positive and welcoming conversational environment.";
    // const result = await streamText({
    //   model: openai("gpt-4-turbo"),
    //   messages,
    // });

    const result = await openai.completions.create({
      model: openai("gpt-3.5-turbo-instruct"),
      max_tokens: 4000,
      stream: true,
      prompts,
    });
    const data = new StreamData();

    data.append({ test: "value" });

    const stream = result.toAIStream({
      onFinal(_) {
        data.close();
      },
    });
    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // name ,header,status,
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.error("unexpedcted error Occured", error);
      throw error;
    }
  }
}
