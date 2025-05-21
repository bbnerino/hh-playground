import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const promptRequest = await req.json();
  try {
    const response = await openai.chat.completions.create(promptRequest);
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "GPT error" }, { status: 500 });
  }
}
