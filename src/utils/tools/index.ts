import { ToolFunctionData } from "@/types/prompts/tool";
import { getWeatherFunctionData, getWeather } from "./getWeather";
import { searchDocuments } from "./searchDocuments";
import { getReviewsFunctionData, getReviews } from "./getReviews";
import { airconFunctionData, handleAircon } from "./handleAircon";

export const tools: ToolFunctionData[] = [getWeatherFunctionData, getReviewsFunctionData, airconFunctionData];

export const toolExecute = {
  getWeather,
  searchDocuments,
  getReviews,
  handleAircon
} as {
  [key: string]: (...args: any[]) => Promise<any>;
};
