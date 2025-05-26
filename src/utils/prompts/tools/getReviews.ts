export const getReviewsFunctionData = {
  type: "function",
  function: {
    name: "getReviews",
    description: "Get reviews in my location",
    parameters: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "The product id of the reviews"
        }
      },
      required: ["productId"]
    }
  }
};

export const getReviews = async ({ productId }: { productId: string }) => {
  const response = await fetch(`/api/review?productId=${productId}`);
  const data = await response.json();
  return data;
};
