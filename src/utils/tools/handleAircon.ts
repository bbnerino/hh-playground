// 에어컨을 on/off, 온도를 조절하는 도구

export const airconFunctionData = {
  type: "function",
  function: {
    name: "handleAircon",
    description: "Control aircon",
    parameters: {
      type: "object",
      properties: {
        on: {
          type: "boolean",
          description: "Whether to turn on the aircon"
        },
        temperature: {
          type: "number",
          description: "The temperature to set the aircon to"
        }
      },
      required: ["productId", "on", "temperature"]
    }
  }
};

export const handleAircon = async ({ on, temperature }: { on: boolean; temperature: number }) => {
  return {
    status: "success",
    aircon: {
      on,
      temperature
    }
  };
};
