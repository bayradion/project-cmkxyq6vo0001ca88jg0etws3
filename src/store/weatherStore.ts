import { create } from 'zustand';
import { 
  WeatherState, 
  WeatherData, 
  ForecastDay, 
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse 
} from '../types';
import { 
  WEATHER_CONFIG, 
  CONDITION_MAPPING, 
  ERROR_MESSAGES,
  validateApiKey,
  getErrorMessage 
} from '../constants/weather-api';

// Helper function to map OpenWeatherMap weather conditions to our app icons
const mapWeatherCondition = (weatherMain: string, weatherDescription: string, weatherIcon: string): string => {
  // First try to match by description
  const description = weatherDescription.toLowerCase();
  if (CONDITION_MAPPING[description]) {
    return CONDITION_MAPPING[description];
  }

  // Fallback to main weather type
  const iconCode = weatherIcon.slice(0, 2);
  const isDay = weatherIcon.includes('d');
  
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return isDay ? 'sunny' : 'clear';
    case 'clouds':
      return iconCode === '02' ? 'partly-sunny' : 'cloudy';
    case 'rain':
    case 'drizzle':
      return 'rainy';
    case 'thunderstorm':
      return 'rainy';
    case 'snow':
      return 'snowy';
    case 'mist':
    case 'smoke':
    case 'haze':
    case 'dust':
    case 'fog':
    case 'sand':
    case 'ash':
    case 'squall':
    case 'tornado':
      return 'foggy';
    default:
      return 'cloudy';
  }
};

// Helper function to get day name from date
const getDayName = (dateStr: string, index: number): string => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Mock UV Index API call (OpenWeatherMap requires separate paid API for UV data)
const getMockUVIndex = (): number => {
  return Math.floor(Math.random() * 11) + 1;
};

// Build API URL with proper error checking
const buildApiUrl = (endpoint: string, params: Record<string, string>): string => {
  const apiKey = WEATHER_CONFIG.API_KEY;
  
  if (!validateApiKey(apiKey)) {
    console.error('Invalid API key:', apiKey);
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
  }
  
  const url = new URL(`${WEATHER_CONFIG.BASE_URL}${endpoint}`);
  
  // Add API key first
  url.searchParams.append('appid', apiKey);
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (key !== 'appid') { // Don't duplicate API key
      url.searchParams.append(key, value);
    }
  });
  
  console.log('Built API URL:', url.toString().replace(apiKey, 'API_KEY_HIDDEN'));
  return url.toString();
};

// Enhanced fetch with better error handling
const fetchWithErrorHandling = async (url: string): Promise<Response> => {
  try {
    console.log('Making API request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API error response:', errorData);
      
      const errorMessage = getErrorMessage(response.status);
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof TypeError) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,

  fetchWeather: async (city = WEATHER_CONFIG.DEFAULT_CITY) => {
    console.log('Fetching weather for city:', city);
    set({ isLoading: true, error: null });
    
    try {
      // Validate API key first
      const apiKey = WEATHER_CONFIG.API_KEY;
      if (!validateApiKey(apiKey)) {
        console.error('API key validation failed');
        throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
      }

      const url = buildApiUrl(WEATHER_CONFIG.CURRENT_WEATHER, {
        q: city,
        units: WEATHER_CONFIG.UNITS,
      });
      
      const response = await fetchWithErrorHandling(url);
      const data: OpenWeatherCurrentResponse = await response.json();
      
      console.log('Weather data received:', data.name);
      
      const weatherData: WeatherData = {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed ? data.wind.speed * 3.6 : 0), // Convert m/s to km/h
        feelsLike: Math.round(data.main.feels_like),
        uvIndex: getMockUVIndex(), // Mock UV data since it requires separate API
        visibility: Math.round((data.visibility || 10000) / 1000), // Convert m to km, default 10km
        pressure: data.main.pressure,
        icon: mapWeatherCondition(
          data.weather[0].main, 
          data.weather[0].description,
          data.weather[0].icon
        ),
      };
      
      set({ 
        currentWeather: weatherData,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERAL_ERROR;
      set({ 
        error: errorMessage,
        isLoading: false,
        currentWeather: null,
      });
    }
  },

  fetchForecast: async (city = WEATHER_CONFIG.DEFAULT_CITY) => {
    console.log('Fetching forecast for city:', city);
    set({ isLoading: true, error: null });
    
    try {
      // Validate API key first
      const apiKey = WEATHER_CONFIG.API_KEY;
      if (!validateApiKey(apiKey)) {
        console.error('API key validation failed for forecast');
        throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
      }

      const url = buildApiUrl(WEATHER_CONFIG.FORECAST, {
        q: city,
        units: WEATHER_CONFIG.UNITS,
      });
      
      const response = await fetchWithErrorHandling(url);
      const data: OpenWeatherForecastResponse = await response.json();
      
      console.log('Forecast data received, items:', data.list.length);
      
      // Group forecast data by day (API returns 3-hour intervals)
      const dailyForecasts: { [key: string]: any } = {};
      
      data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temps: [],
            conditions: [],
            precipitations: [],
          };
        }
        
        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].conditions.push({
          main: item.weather[0].main,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        });
        dailyForecasts[date].precipitations.push(item.pop * 100);
      });
      
      // Convert to our forecast format and take first 5 days
      const forecast: ForecastDay[] = Object.keys(dailyForecasts)
        .slice(0, 5)
        .map((dateStr, index) => {
          const dayData = dailyForecasts[dateStr];
          const temps = dayData.temps;
          const mostCommonCondition = dayData.conditions[0]; // Take first condition of the day
          
          return {
            date: dateStr,
            dayName: getDayName(dateStr, index),
            high: Math.round(Math.max(...temps)),
            low: Math.round(Math.min(...temps)),
            condition: mostCommonCondition.description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
            icon: mapWeatherCondition(
              mostCommonCondition.main, 
              mostCommonCondition.description,
              mostCommonCondition.icon
            ),
            precipitation: Math.round(Math.max(...dayData.precipitations)),
          };
        });
      
      set({ 
        forecast,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Forecast fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.GENERAL_ERROR;
      set({ 
        error: errorMessage,
        isLoading: false,
        forecast: [],
      });
    }
  },

  // Helper method to clear errors
  clearError: () => set({ error: null }),

  // Helper method to refresh weather data
  refreshWeather: async (city?: string) => {
    const state = get();
    if (state.currentWeather && !city) {
      // Extract city from current location
      const currentCity = state.currentWeather.location.split(',')[0];
      await state.fetchWeather(currentCity);
      await state.fetchForecast(currentCity);
    } else {
      await state.fetchWeather(city);
      await state.fetchForecast(city);
    }
  },
}));