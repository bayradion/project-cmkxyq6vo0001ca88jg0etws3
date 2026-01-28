// OpenWeatherMap API Configuration
// Sign up at: https://openweathermap.org/api
// Replace 'demo_key' with your actual API key

export const WEATHER_CONFIG = {
  API_KEY: 'demo_key', // Replace with your OpenWeatherMap API key
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_CITY: 'New York',
  UNITS: 'metric', // metric for Celsius, imperial for Fahrenheit
};

// Weather condition mapping for consistent icons
export const CONDITION_MAPPING = {
  'clear sky': 'sunny',
  'few clouds': 'partly-sunny',
  'scattered clouds': 'cloudy',
  'broken clouds': 'cloudy',
  'overcast clouds': 'cloudy',
  'shower rain': 'rainy',
  'light rain': 'rainy',
  'moderate rain': 'rainy',
  'heavy intensity rain': 'rainy',
  'thunderstorm': 'rainy',
  'snow': 'snowy',
  'mist': 'foggy',
  'fog': 'foggy',
  'haze': 'foggy',
};

// Error messages for better UX
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Weather service unavailable. Please check API configuration.',
  CITY_NOT_FOUND: 'Location not found. Please try a different city name.',
  NETWORK_ERROR: 'Unable to connect to weather service. Check your internet connection.',
  GENERAL_ERROR: 'Unable to fetch weather data. Please try again later.',
};