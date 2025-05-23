import { ToolFunctionData } from "@/types/prompts/tool";
import { getWeatherFunctionData, getWeather } from "./getWeather";

export const tools: ToolFunctionData[] = [getWeatherFunctionData];

export const toolExecute = {
  getWeather
} as {
  [key: string]: (...args: any[]) => Promise<any>;
};
