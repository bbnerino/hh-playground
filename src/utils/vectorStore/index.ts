export const uploadVectorStoreFile = async ({ name, file }: { name: string; file: File }) => {
  if (!file) return;

  try {
    const text = await file.text();
    const chunks = splitText(text);
    const embeddings = await getEmbeddings(chunks);

    if (!embeddings.length) {
      throw new Error("Failed to generate embeddings");
    }

    const response = await fetch(`/api/vectorStore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, chunks, embeddings })
    });
    console.log("response", response);

    if (!response.ok) {
      throw new Error("Failed to upload to vector store");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

const splitText = (text: string, chunkSize = 500) => {
  // 간단하게 줄바꿈 기준으로 분할
  const lines = text.split("\n");
  const chunks = [];
  let current = "";
  for (const line of lines) {
    if ((current + line).length > chunkSize) {
      chunks.push(current);
      current = "";
    }
    current += line + "\n";
  }
  if (current) chunks.push(current);
  return chunks;
};

export async function getEmbeddings(texts: string[]) {
  try {
    const response = await fetch("/api/vectorStore/embedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts })
    });
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.embeddings;
  } catch (error) {
    console.error("Embedding Error:", error);
    return [];
  }
}
