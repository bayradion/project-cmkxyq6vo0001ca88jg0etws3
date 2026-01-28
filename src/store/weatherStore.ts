import { create } from 'zustand';
import { 
  WeatherState, 
  WeatherData, 
  ForecastDay, 
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse 
} from '../types';

// OpenWeatherMap API configuration
const API_KEY = 'demo_key'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper function to map OpenWeatherMap weather conditions to our app icons
const mapWeatherCondition = (weatherMain: string, weatherIcon: string): string => {
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

export const useWeatherStore = create<WeatherState>((set) => ({
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,

  fetchWeather: async (city = 'New York') => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else if (response.status === 404) {
          throw new Error('City not found. Please check the city name.');
        } else {
          throw new Error(`Weather service error: ${response.status}`);
        }
      }
      
      const data: OpenWeatherCurrentResponse = await response.json();
      
      const weatherData: WeatherData = {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        feelsLike: Math.round(data.main.feels_like),
        uvIndex: getMockUVIndex(), // Mock UV data
        visibility: Math.round(data.visibility / 1000), // Convert m to km
        pressure: data.main.pressure,
        icon: mapWeatherCondition(data.weather[0].main, data.weather[0].icon),
      };
      
      set({ 
        currentWeather: weatherData,
        isLoading: false 
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
        isLoading: false 
      });
    }
  },

  fetchForecast: async (city = 'New York') => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else if (response.status === 404) {
          throw new Error('City not found. Please check the city name.');
        } else {
          throw new Error(`Forecast service error: ${response.status}`);
        }
      }
      
      const data: OpenWeatherForecastResponse = await response.json();
      
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
            icon: mapWeatherCondition(mostCommonCondition.main, mostCommonCondition.icon),
            precipitation: Math.round(Math.max(...dayData.precipitations)),
          };
        });
      
      set({ 
        forecast,
        isLoading: false 
      });
    } catch (error) {
      console.error('Forecast fetch error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch forecast data',
        isLoading: false 
      });
    }
  },
}));