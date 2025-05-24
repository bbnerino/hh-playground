import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";

const BASIC_URL = "https://cbc91cd2-028c-4301-95d7-f15bf81d87b9.us-west-1-0.aws.cloud.qdrant.io";

export async function POST(req: NextRequest) {
  const { name, chunks, embeddings } = await req.json();
  const client = new QdrantClient({ url: BASIC_URL, port: 6333, apiKey: process.env.QDRANT_API_KEY });

  const vectorSize = embeddings[0]?.length || 1536;
  let collection;
  try {
    collection = await client.getCollection(name);
    // config.params.vectors가 undefined일 수 있으니 optional chaining 사용
    if (collection.config?.params?.vectors?.size !== vectorSize) {
      await client.deleteCollection(name);
      await client.createCollection(name, {
        vectors: { size: vectorSize, distance: "Cosine" }
      });
    }
  } catch (error: any) {
    await client.createCollection(name, {
      vectors: { size: vectorSize, distance: "Cosine" }
    });
  }

  try {
    const points = chunks.map((chunk: string, idx: number) => ({
      id: uuidv4(),
      vector: embeddings[idx],
      payload: { text: chunk }
    }));
    await client.upsert(name, { wait: true, points });
    return NextResponse.json({ success: true, count: points.length, name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload to vector store" }, { status: 500 });
  }
}
