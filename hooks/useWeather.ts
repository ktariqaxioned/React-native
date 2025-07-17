import { fetchWeather } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const useWeather = (lat: number, lon: number) =>
  useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat, lon),
  });
