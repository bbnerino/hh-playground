import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat") || "";
  const lon = req.nextUrl.searchParams.get("lon") || "";

  const getWeatherToolExecute = async (lat: string, lon: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    return data;
  };
  try {
    const response = await getWeatherToolExecute(lat, lon);

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "WEATHER API error" }, { status: 500 });
  }
}
