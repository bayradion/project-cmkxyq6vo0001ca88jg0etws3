export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastDay[];
  isLoading: boolean;
  error: string | null;
  fetchWeather: () => Promise<void>;
  fetchForecast: () => Promise<void>;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'clear' | 'default';