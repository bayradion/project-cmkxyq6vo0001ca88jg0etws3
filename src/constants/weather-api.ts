// OpenWeatherMap API Configuration
// Sign up at: https://openweathermap.org/api to get your free API key
// Steps to get API key:
// 1. Go to https://openweathermap.org/api
// 2. Click "Subscribe" under "Current Weather Data" (it's free for up to 1000 calls/day)
// 3. Create an account or sign in
// 4. Go to API Keys section in your account
// 5. Copy your API key and replace the API_KEY below

export const WEATHER_CONFIG = {
  // IMPORTANT: Replace this with your actual OpenWeatherMap API key
  // The current key appears to be invalid or expired
  API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE', // Replace with valid API key
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_CITY: 'New York',
  UNITS: 'metric', // metric for Celsius, imperial for Fahrenheit
  TIMEOUT: 10000, // 10 seconds timeout
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // API endpoints
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
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
  'very heavy rain': 'rainy',
  'extreme rain': 'rainy',
  'freezing rain': 'rainy',
  'light intensity shower rain': 'rainy',
  'heavy intensity shower rain': 'rainy',
  'ragged shower rain': 'rainy',
  'thunderstorm': 'rainy',
  'thunderstorm with light rain': 'rainy',
  'thunderstorm with rain': 'rainy',
  'thunderstorm with heavy rain': 'rainy',
  'light thunderstorm': 'rainy',
  'heavy thunderstorm': 'rainy',
  'ragged thunderstorm': 'rainy',
  'thunderstorm with light drizzle': 'rainy',
  'thunderstorm with drizzle': 'rainy',
  'thunderstorm with heavy drizzle': 'rainy',
  'light intensity drizzle': 'rainy',
  'drizzle': 'rainy',
  'heavy intensity drizzle': 'rainy',
  'light intensity drizzle rain': 'rainy',
  'drizzle rain': 'rainy',
  'heavy intensity drizzle rain': 'rainy',
  'shower rain and drizzle': 'rainy',
  'heavy shower rain and drizzle': 'rainy',
  'shower drizzle': 'rainy',
  'snow': 'snowy',
  'light snow': 'snowy',
  'heavy snow': 'snowy',
  'sleet': 'snowy',
  'light shower sleet': 'snowy',
  'shower sleet': 'snowy',
  'light rain and snow': 'snowy',
  'rain and snow': 'snowy',
  'light shower snow': 'snowy',
  'shower snow': 'snowy',
  'heavy shower snow': 'snowy',
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

// Enhanced error messages for better UX
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key. Please check your OpenWeatherMap API key configuration.',
  API_KEY_NOT_SET: 'API key not configured. Please get a free API key from https://openweathermap.org/api and update the configuration.',
  CITY_NOT_FOUND: 'Location not found. Please check the city name and try again.',
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please check your connection and try again.',
  GENERAL_ERROR: 'Unable to fetch weather data. Please try again later.',
  RATE_LIMIT: 'API rate limit exceeded. Please wait a moment before trying again.',
  SERVER_ERROR: 'Weather service is temporarily unavailable. Please try again later.',
  CONNECTION_REFUSED: 'Unable to connect to weather service. Please check your internet connection.',
  API_UNAVAILABLE: 'Weather service is currently unavailable. Please try again later.',
};

// API status codes mapping
export const API_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Enhanced validation function for API key
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    console.warn('API key is null, undefined, or not a string');
    return false;
  }
  
  // Check if it's not a placeholder value
  const invalidKeys = [
    'YOUR_API_KEY_HERE', 
    'YOUR_OPENWEATHER_API_KEY_HERE',
    'demo_key', 
    '', 
    'null', 
    'undefined',
    'test',
    'sample',
    'placeholder'
  ];
  
  if (invalidKeys.includes(apiKey.toLowerCase())) {
    console.warn('API key appears to be a placeholder value');
    return false;
  }
  
  // OpenWeatherMap API keys are typically 32 characters long and contain only alphanumeric characters
  if (apiKey.length < 16 || apiKey.length > 40) {
    console.warn('API key length is invalid (should be 16-40 characters)');
    return false;
  }
  
  // Check for valid characters (alphanumeric)
  if (!/^[a-zA-Z0-9]+$/.test(apiKey)) {
    console.warn('API key contains invalid characters (should be alphanumeric only)');
    return false;
  }
  
  return true;
};

// Get error message based on status code with enhanced mapping
export const getErrorMessage = (statusCode: number, responseText?: string): string => {
  console.log('API Error - Status:', statusCode, 'Response:', responseText);
  
  switch (statusCode) {
    case API_STATUS.BAD_REQUEST:
      return responseText?.includes('city not found') 
        ? ERROR_MESSAGES.CITY_NOT_FOUND 
        : ERROR_MESSAGES.GENERAL_ERROR;
    case API_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.INVALID_API_KEY;
    case API_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.INVALID_API_KEY;
    case API_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.CITY_NOT_FOUND;
    case API_STATUS.RATE_LIMIT:
      return ERROR_MESSAGES.RATE_LIMIT;
    case API_STATUS.SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    case API_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES.API_UNAVAILABLE;
    default:
      if (statusCode >= 500) {
        return ERROR_MESSAGES.SERVER_ERROR;
      }
      return ERROR_MESSAGES.NETWORK_ERROR;
  }
};

// Enhanced API key testing with retry mechanism
export const testApiKey = async (apiKey: string, retries = 2): Promise<{ valid: boolean; error?: string }> => {
  try {
    if (!validateApiKey(apiKey)) {
      return { valid: false, error: ERROR_MESSAGES.INVALID_API_KEY };
    }
    
    console.log('Testing API key validity...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEATHER_CONFIG.TIMEOUT);
    
    const testUrl = `${WEATHER_CONFIG.BASE_URL}${WEATHER_CONFIG.CURRENT_WEATHER}?q=London&appid=${apiKey}&units=metric`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('API key test successful');
      return { valid: true };
    }
    
    const errorText = await response.text();
    const errorMessage = getErrorMessage(response.status, errorText);
    
    console.warn('API key test failed:', response.status, errorText);
    return { valid: false, error: errorMessage };
    
  } catch (error) {
    console.error('API key test error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        if (retries > 0) {
          console.log(`API test timeout, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, WEATHER_CONFIG.RETRY_DELAY));
          return testApiKey(apiKey, retries - 1);
        }
        return { valid: false, error: ERROR_MESSAGES.TIMEOUT_ERROR };
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        if (retries > 0) {
          console.log(`Network error, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, WEATHER_CONFIG.RETRY_DELAY));
          return testApiKey(apiKey, retries - 1);
        }
        return { valid: false, error: ERROR_MESSAGES.NETWORK_ERROR };
      }
    }
    
    return { valid: false, error: ERROR_MESSAGES.GENERAL_ERROR };
  }
};

// Network connectivity check
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Try to fetch a simple endpoint to check connectivity
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Network connectivity check failed:', error);
    return false;
  }
};

// Fallback weather data for offline mode
export const getFallbackWeatherData = (city: string) => ({
  location: city,
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 15,
  feelsLike: 25,
  uvIndex: 3,
  visibility: 10,
  pressure: 1013,
  icon: 'partly-sunny',
});

export const getFallbackForecast = () => [
  {
    date: new Date().toISOString().split('T')[0],
    dayName: 'Today',
    high: 25,
    low: 18,
    condition: 'Partly Cloudy',
    icon: 'partly-sunny',
    precipitation: 20,
  },
  {
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dayName: 'Tomorrow',
    high: 23,
    low: 16,
    condition: 'Cloudy',
    icon: 'cloudy',
    precipitation: 40,
  },
  {
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dayName: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { weekday: 'long' }),
    high: 21,
    low: 14,
    condition: 'Rainy',
    icon: 'rainy',
    precipitation: 80,
  },
  {
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    dayName: new Date(Date.now() + 259200000).toLocaleDateString('en-US', { weekday: 'long' }),
    high: 26,
    low: 19,
    condition: 'Sunny',
    icon: 'sunny',
    precipitation: 5,
  },
  {
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    dayName: new Date(Date.now() + 345600000).toLocaleDateString('en-US', { weekday: 'long' }),
    high: 24,
    low: 17,
    condition: 'Partly Cloudy',
    icon: 'partly-sunny',
    precipitation: 30,
  },
];