import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAI } from "openai";

const BASIC_URL = "https://cbc91cd2-028c-4301-95d7-f15bf81d87b9.us-west-1-0.aws.cloud.qdrant.io";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vectorCollection = searchParams.get("vectorCollection") || "";
  const query = searchParams.get("query") || "";
  const limit = Number(searchParams.get("limit") || 5);

  const client = new QdrantClient({ url: BASIC_URL, port: 6333, apiKey: process.env.QDRANT_API_KEY });

  // 1. 쿼리 임베딩 생성
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  // 2. Qdrant에서 벡터 검색
  const results = await client.search(vectorCollection, {
    vector: queryEmbedding,
    limit
  });

  return NextResponse.json(results);
}
