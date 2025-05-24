import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      models: [
        { name: "gpt-4.1", description: "temp: 1.00 tokens: 2048 top_p: 1.00 store: true" },
        { name: "gpt-4.1-mini", description: "temp: 1.00 tokens: 2048 top_p: 1.00 store: true" }
      ]
    },
    { status: 200 }
  );
}
