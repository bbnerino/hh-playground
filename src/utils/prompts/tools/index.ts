import { ToolFunctionData } from "@/types/prompts/tool";
import { getWeatherFunctionData, getWeather } from "./getWeather";
import { searchDocuments } from "./searchDocuments";
export const tools: ToolFunctionData[] = [getWeatherFunctionData];

export const toolExecute = {
  getWeather,
  searchDocuments
} as {
  [key: string]: (...args: any[]) => Promise<any>;
};
