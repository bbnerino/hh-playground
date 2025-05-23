export const getWeatherFunctionData = {
  type: "function",
  function: {
    name: "getWeather",
    description: "Get weather in my location",
    parameters: {
      type: "object",
      properties: {
        lat: {
          type: "number",
          description: "The latitude of the location"
        },
        lon: {
          type: "number",
          description: "The longitude of the location"
        }
      },
      required: ["lat", "lon"]
    }
  }
};

export const getWeather = async ({ lat, lon }: { lat: number; lon: number }) => {
  const response = await fetch(`/api/tools/weather?lat=${lat}&lon=${lon}`);
  const data = await response.json();
  return data;
};
