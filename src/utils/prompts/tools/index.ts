import { getWeatherRequest, getWeather } from "./getWeather";

export const tools = [getWeatherRequest];

export const toolExecute = {
  getWeather
} as {
  [key: string]: (...args: any[]) => Promise<any>;
};
