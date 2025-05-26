import { ToolFunctionData } from "@/types/prompts/tool";
import { getWeatherFunctionData, getWeather } from "./getWeather";
import { searchDocuments } from "./searchDocuments";
import { getReviewsFunctionData, getReviews } from "./getReviews";

export const tools: ToolFunctionData[] = [getWeatherFunctionData, getReviewsFunctionData];

export const toolExecute = {
  getWeather,
  searchDocuments,
  getReviews
} as {
  [key: string]: (...args: any[]) => Promise<any>;
};
