import axios from "axios";

export type WeatherData = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: {
    time: string; // likely "iso8601"
    interval: string; // e.g. "seconds"
    temperature_2m: string; // e.g. "°C"
  };

  current: {
    time: string; // e.g. "2025-07-17T12:30"
    interval: number;
    temperature_2m: number;
  };

  hourly_units: {
    time: string; // likely "iso8601"
    temperature_2m: string; // e.g. "°C"
  };

  hourly: {
    time: string[]; // ISO8601 timestamps
    temperature_2m: number[];
  };
};

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m`;
  const res = await axios.get(url);
  return res.data;
};
