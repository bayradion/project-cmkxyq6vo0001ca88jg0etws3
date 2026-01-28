import { create } from 'zustand';
import { WeatherState, WeatherData, ForecastDay } from '../types';

// Mock weather data - in real app, this would come from an API
const mockCurrentWeather: WeatherData = {
  location: 'New York, NY',
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  feelsLike: 25,
  uvIndex: 6,
  visibility: 10,
  pressure: 1013,
  icon: 'partly-sunny',
};

const mockForecast: ForecastDay[] = [
  {
    date: '2024-01-15',
    dayName: 'Today',
    high: 25,
    low: 18,
    condition: 'Sunny',
    icon: 'sunny',
    precipitation: 0,
  },
  {
    date: '2024-01-16',
    dayName: 'Tomorrow',
    high: 23,
    low: 16,
    condition: 'Partly Cloudy',
    icon: 'partly-sunny',
    precipitation: 10,
  },
  {
    date: '2024-01-17',
    dayName: 'Wednesday',
    high: 20,
    low: 14,
    condition: 'Cloudy',
    icon: 'cloudy',
    precipitation: 30,
  },
  {
    date: '2024-01-18',
    dayName: 'Thursday',
    high: 18,
    low: 12,
    condition: 'Rainy',
    icon: 'rainy',
    precipitation: 80,
  },
  {
    date: '2024-01-19',
    dayName: 'Friday',
    high: 24,
    low: 17,
    condition: 'Sunny',
    icon: 'sunny',
    precipitation: 5,
  },
];

export const useWeatherStore = create<WeatherState>((set) => ({
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,

  fetchWeather: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        currentWeather: mockCurrentWeather,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch weather data',
        isLoading: false 
      });
    }
  },

  fetchForecast: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ 
        forecast: mockForecast,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch forecast data',
        isLoading: false 
      });
    }
  },
}));