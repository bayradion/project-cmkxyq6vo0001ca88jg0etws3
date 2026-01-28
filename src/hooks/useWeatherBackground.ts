import { useMemo } from 'react';
import { WeatherCondition, WeatherData } from '../types';
import { weatherGradients } from '../constants/theme';

export const useWeatherBackground = (weather: WeatherData | null): string[] => {
  return useMemo(() => {
    if (!weather) return weatherGradients.default;

    const condition = weather.condition.toLowerCase();
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      return weatherGradients.sunny;
    }
    if (condition.includes('rain') || condition.includes('storm')) {
      return weatherGradients.rainy;
    }
    if (condition.includes('cloud')) {
      return weatherGradients.cloudy;
    }
    if (condition.includes('snow')) {
      return weatherGradients.snowy;
    }
    if (condition.includes('fog') || condition.includes('mist')) {
      return weatherGradients.foggy;
    }
    
    return weatherGradients.clear;
  }, [weather?.condition]);
};