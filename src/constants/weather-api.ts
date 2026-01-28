// OpenWeatherMap API Configuration
// Sign up at: https://openweathermap.org/api to get your free API key
// Steps to get API key:
// 1. Go to https://openweathermap.org/api
// 2. Click "Subscribe" under "Current Weather Data" (it's free for up to 1000 calls/day)
// 3. Create an account or sign in
// 4. Go to API Keys section in your account
// 5. Copy your API key and replace 'YOUR_API_KEY_HERE' below

export const WEATHER_CONFIG = {
  // Replace this with your actual OpenWeatherMap API key
  API_KEY: 'e724c58404f238764e1588e742372c34',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_CITY: 'New York',
  UNITS: 'metric', // metric for Celsius, imperial for Fahrenheit
  
  // API endpoints
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
  
  // Request parameters
  DEFAULT_PARAMS: {
    units: 'metric',
    appid: 'e724c58404f238764e1588e742372c34', // Set API key here too
  },
};

// Weather condition mapping for consistent icons
export const CONDITION_MAPPING: Record<string, string> = {
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
  'light snow': 'snowy',
  'heavy snow': 'snowy',
  'mist': 'foggy',
  'fog': 'foggy',
  'haze': 'foggy',
  'smoke': 'foggy',
  'dust': 'foggy',
  'sand': 'foggy',
  'ash': 'foggy',
  'squall': 'cloudy',
  'tornado': 'cloudy',
};

// Error messages for better UX
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Weather service unavailable. Please configure a valid API key from OpenWeatherMap.',
  API_KEY_NOT_SET: 'API key not configured. Please get a free API key from https://openweathermap.org/api',
  CITY_NOT_FOUND: 'Location not found. Please try a different city name.',
  NETWORK_ERROR: 'Unable to connect to weather service. Check your internet connection.',
  GENERAL_ERROR: 'Unable to fetch weather data. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
};

// API status codes mapping
export const API_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
};

// Validation function for API key
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Check if it's not a placeholder value
  const invalidKeys = ['YOUR_API_KEY_HERE', 'demo_key', '', 'null', 'undefined'];
  if (invalidKeys.includes(apiKey)) {
    return false;
  }
  
  // OpenWeatherMap API keys are typically 32 characters long
  if (apiKey.length < 10) {
    return false;
  }
  
  return true;
};

// Get error message based on status code
export const getErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case API_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.INVALID_API_KEY;
    case API_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.CITY_NOT_FOUND;
    case API_STATUS.RATE_LIMIT:
      return ERROR_MESSAGES.RATE_LIMIT;
    case API_STATUS.SERVER_ERROR:
      return ERROR_MESSAGES.GENERAL_ERROR;
    default:
      return ERROR_MESSAGES.NETWORK_ERROR;
  }
};

// Test API key validity by making a simple request
export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    if (!validateApiKey(apiKey)) {
      return false;
    }
    
    const testUrl = `${WEATHER_CONFIG.BASE_URL}${WEATHER_CONFIG.CURRENT_WEATHER}?q=London&appid=${apiKey}&units=metric`;
    const response = await fetch(testUrl);
    
    return response.ok;
  } catch (error) {
    console.warn('API key test failed:', error);
    return false;
  }
};