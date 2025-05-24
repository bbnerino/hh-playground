export const getVectorStoreFunctionData = {
  type: "function",
  function: {
    name: "getVectorStore",
    description: "Get vector store",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the vector store"
        }
      },
      required: ["name"]
    }
  }
};

export const getVectorStore = async ({ name }: { name: string }) => {
  const response = await fetch(`/api/tools/vectorStore?name=${name}`);
  const data = await response.json();
  return data;
};

