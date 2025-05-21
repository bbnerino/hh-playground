import { NextRequest, NextResponse } from "next/server";

function l2Distance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

function searchTopK(embeddings: number[][], queryEmbedding: number[], k: number) {
  const distances = embeddings.map((emb) => l2Distance(queryEmbedding, emb));
  return distances
    .map((dist, idx) => ({ dist, idx }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k)
    .map((item) => ({ idx: item.idx, dist: item.dist }));
}

export async function POST(req: NextRequest) {
  const { embeddings, queryEmbedding, k = 10 } = await req.json();
  if (!embeddings || !Array.isArray(embeddings) || !queryEmbedding) {
    return NextResponse.json({ error: "No embeddings or queryEmbedding provided" }, { status: 400 });
  }

  try {
    const topK = searchTopK(embeddings, queryEmbedding, k);
    return NextResponse.json({
      topKIndices: topK.map((item) => item.idx),
      topKDistances: topK.map((item) => item.dist)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search error" }, { status: 500 });
  }
}
