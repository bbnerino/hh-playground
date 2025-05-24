import { VectorCollection } from "@/types/prompts/vectorStore";

export const searchDocumentsFunctionData = (vectorCollections: VectorCollection[]) => {
  return {
    type: "function",
    function: {
      name: "searchDocuments",
      description: "Search documents in my location",
      parameters: {
        type: "object",
        properties: {
          vectorCollection: {
            type: "string",
            description: `The available vector collections are: ${JSON.stringify(
              vectorCollections
            )}. You must provide one of these names.`
          },
          query: {
            type: "string",
            description: "The query to search for"
          }
        },
        required: ["vectorCollection", "query"]
      }
    }
  };
};

export const searchDocuments = async ({ query, vectorCollection }: { query: string; vectorCollection: string }) => {
  const response = await fetch(`/api/vectorStore/searchDocuments?query=${query}&vectorCollection=${vectorCollection}`);
  const data = await response.json();
  return data;
};
