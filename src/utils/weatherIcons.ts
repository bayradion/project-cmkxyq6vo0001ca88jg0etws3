import { Ionicons } from '@expo/vector-icons';

export const getWeatherIcon = (condition: string): keyof typeof Ionicons.glyphMap => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return 'sunny';
  }
  if (conditionLower.includes('partly') && conditionLower.includes('cloud')) {
    return 'partly-sunny';
  }
  if (conditionLower.includes('cloud')) {
    return 'cloudy';
  }
  if (conditionLower.includes('rain')) {
    return 'rainy';
  }
  if (conditionLower.includes('snow')) {
    return 'snow';
  }
  if (conditionLower.includes('storm')) {
    return 'thunderstorm';
  }
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return 'cloudy';
  }
  
  return 'partly-sunny';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};