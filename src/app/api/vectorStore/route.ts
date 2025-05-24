import { NextRequest, NextResponse } from "next/server";

const BASIC_URL = "https://cbc91cd2-028c-4301-95d7-f15bf81d87b9.us-west-1-0.aws.cloud.qdrant.io:6333";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BASIC_URL}`, {
      headers: {
        "api-key": `${process.env.QDRANT_API_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "QDRANT API error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const response = await fetch(`${BASIC_URL}/collections/${name}/points`, {
    method: "POST",
    headers: {
      "api-key": `${process.env.QDRANT_API_KEY}`
    }
  });
  const data = await response.json();
  return data;
}
