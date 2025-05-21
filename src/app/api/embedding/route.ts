import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { texts } = await req.json();
  if (!texts || !Array.isArray(texts)) {
    return NextResponse.json({ error: "No texts provided" }, { status: 400 });
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texts
    });
    const embeddings = response.data.map((item: any) => item.embedding);
    return NextResponse.json({ embeddings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Embedding error" }, { status: 500 });
  }
}
