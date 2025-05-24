import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";

const BASIC_URL = "https://cbc91cd2-028c-4301-95d7-f15bf81d87b9.us-west-1-0.aws.cloud.qdrant.io";

export async function GET(req: NextRequest) {
  const client = new QdrantClient({ url: BASIC_URL, port: 6333, apiKey: process.env.QDRANT_API_KEY });

  const vectorCollections = await client.getCollections();

  return NextResponse.json(vectorCollections);
}
