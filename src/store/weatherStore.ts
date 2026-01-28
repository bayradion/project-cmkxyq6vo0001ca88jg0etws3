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
  getErrorMessage,
  testApiKey,
  checkNetworkConnectivity,
  getFallbackWeatherData,
  getFallbackForecast
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
    console.error('Invalid API key detected during URL building');
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
  }
  
  const url = new URL(`${WEATHER_CONFIG.BASE_URL}${endpoint}`);
  
  // Add API key first
  url.searchParams.append('appid', apiKey);
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (key !== 'appid' && value) { // Don't duplicate API key and skip empty values
      url.searchParams.append(key, value);
    }
  });
  
  console.log('Built API URL:', url.toString().replace(apiKey, 'API_KEY_HIDDEN'));
  return url.toString();
};

// Enhanced fetch with comprehensive error handling and retry mechanism
const fetchWithErrorHandling = async (url: string, retries = WEATHER_CONFIG.RETRY_ATTEMPTS): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEATHER_CONFIG.TIMEOUT);
  
  try {
    console.log(`Making API request (${WEATHER_CONFIG.RETRY_ATTEMPTS - retries + 1}/${WEATHER_CONFIG.RETRY_ATTEMPTS})...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'WeatherApp/1.0',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log('API response received - Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API error response:', response.status, errorData);
      
      const errorMessage = getErrorMessage(response.status, errorData);
      
      // Retry on server errors if retries are available
      if (response.status >= 500 && retries > 0) {
        console.log(`Server error, retrying in ${WEATHER_CONFIG.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, WEATHER_CONFIG.RETRY_DELAY));
        return fetchWithErrorHandling(url, retries - 1);
      }
      
      throw new Error(errorMessage);
    }
    
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', error);
    
    if (error instanceof Error) {
      // Handle timeout errors
      if (error.name === 'AbortError') {
        if (retries > 0) {
          console.log(`Request timeout, retrying in ${WEATHER_CONFIG.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, WEATHER_CONFIG.RETRY_DELAY));
          return fetchWithErrorHandling(url, retries - 1);
        }
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('Network request failed') || 
          error.message.includes('fetch')) {
        if (retries > 0) {
          console.log(`Network error, retrying in ${WEATHER_CONFIG.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, WEATHER_CONFIG.RETRY_DELAY));
          return fetchWithErrorHandling(url, retries - 1);
        }
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      
      // Re-throw API errors (already processed above)
      if (error.message.includes('Invalid API key') || 
          error.message.includes('Location not found') || 
          error.message.includes('rate limit')) {
        throw error;
      }
    }
    
    throw new Error(ERROR_MESSAGES.GENERAL_ERROR);
  }
};

// Enhanced API key validation with real-time testing
const validateAndTestApiKey = async (): Promise<{ valid: boolean; error?: string }> => {
  const apiKey = WEATHER_CONFIG.API_KEY;
  
  // Basic validation first
  if (!validateApiKey(apiKey)) {
    return { 
      valid: false, 
      error: apiKey.includes('YOUR_') ? ERROR_MESSAGES.API_KEY_NOT_SET : ERROR_MESSAGES.INVALID_API_KEY 
    };
  }
  
  // Test the API key with actual request
  return await testApiKey(apiKey);
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,

  fetchWeather: async (city = WEATHER_CONFIG.DEFAULT_CITY) => {
    console.log('=== Starting weather fetch for city:', city, '===');
    set({ isLoading: true, error: null });
    
    try {
      // Step 1: Validate and test API key
      console.log('Step 1: Validating API key...');
      const apiKeyTest = await validateAndTestApiKey();
      
      if (!apiKeyTest.valid) {
        console.error('API key validation failed:', apiKeyTest.error);
        
        // Check network connectivity
        const hasNetwork = await checkNetworkConnectivity();
        if (!hasNetwork) {
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        
        throw new Error(apiKeyTest.error || ERROR_MESSAGES.INVALID_API_KEY);
      }
      
      console.log('Step 2: API key validated successfully');
      
      // Step 3: Build API URL
      const url = buildApiUrl(WEATHER_CONFIG.CURRENT_WEATHER, {
        q: city,
        units: WEATHER_CONFIG.UNITS,
      });
      
      // Step 4: Fetch weather data
      console.log('Step 3: Fetching weather data...');
      const response = await fetchWithErrorHandling(url);
      const data: OpenWeatherCurrentResponse = await response.json();
      
      console.log('Step 4: Weather data received for:', data.name, data.sys.country);
      
      // Step 5: Transform data
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
      
      console.log('Step 5: Weather data processed successfully');
      set({ 
        currentWeather: weatherData,
        isLoading: false,
        error: null,
      });
      
    } catch (error) {
      console.error('=== Weather fetch failed ===');
      console.error('Error details:', error);
      
      let errorMessage = ERROR_MESSAGES.GENERAL_ERROR;
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // If it's an API key issue, provide helpful guidance
        if (errorMessage.includes('Invalid API key') || errorMessage.includes('API key not configured')) {
          console.error('API Key Issue: Please check your OpenWeatherMap API key configuration');
          console.error('Current API key starts with:', WEATHER_CONFIG.API_KEY.substring(0, 8) + '...');
          console.error('Get a free API key at: https://openweathermap.org/api');
        }
        
        // Check if we should provide fallback data
        if (errorMessage.includes('Network') || errorMessage.includes('timeout')) {
          console.log('Network issue detected, checking connectivity...');
          const hasNetwork = await checkNetworkConnectivity();
          if (!hasNetwork) {
            console.log('No network connectivity detected, using fallback data');
            const fallbackData = getFallbackWeatherData(city);
            set({ 
              currentWeather: fallbackData,
              isLoading: false,
              error: 'Using offline data - ' + ERROR_MESSAGES.NETWORK_ERROR,
            });
            return;
          }
        }
      }
      
      set({ 
        error: errorMessage,
        isLoading: false,
        currentWeather: null,
      });
    }
  },

  fetchForecast: async (city = WEATHER_CONFIG.DEFAULT_CITY) => {
    console.log('=== Starting forecast fetch for city:', city, '===');
    set({ isLoading: true, error: null });
    
    try {
      // Step 1: Validate and test API key
      console.log('Step 1: Validating API key for forecast...');
      const apiKeyTest = await validateAndTestApiKey();
      
      if (!apiKeyTest.valid) {
        console.error('API key validation failed for forecast:', apiKeyTest.error);
        
        // Check network connectivity
        const hasNetwork = await checkNetworkConnectivity();
        if (!hasNetwork) {
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        
        throw new Error(apiKeyTest.error || ERROR_MESSAGES.INVALID_API_KEY);
      }
      
      console.log('Step 2: API key validated for forecast');
      
      // Step 3: Build API URL
      const url = buildApiUrl(WEATHER_CONFIG.FORECAST, {
        q: city,
        units: WEATHER_CONFIG.UNITS,
      });
      
      // Step 4: Fetch forecast data
      console.log('Step 3: Fetching forecast data...');
      const response = await fetchWithErrorHandling(url);
      const data: OpenWeatherForecastResponse = await response.json();
      
      console.log('Step 4: Forecast data received, processing', data.list.length, 'items');
      
      // Step 5: Group forecast data by day (API returns 3-hour intervals)
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
      
      // Step 6: Convert to our forecast format and take first 5 days
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
      
      console.log('Step 5: Forecast data processed successfully, days:', forecast.length);
      set({ 
        forecast,
        isLoading: false,
        error: null,
      });
      
    } catch (error) {
      console.error('=== Forecast fetch failed ===');
      console.error('Error details:', error);
      
      let errorMessage = ERROR_MESSAGES.GENERAL_ERROR;
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check if we should provide fallback data
        if (errorMessage.includes('Network') || errorMessage.includes('timeout')) {
          console.log('Network issue detected for forecast, checking connectivity...');
          const hasNetwork = await checkNetworkConnectivity();
          if (!hasNetwork) {
            console.log('No network connectivity detected, using fallback forecast data');
            const fallbackForecast = getFallbackForecast();
            set({ 
              forecast: fallbackForecast,
              isLoading: false,
              error: 'Using offline data - ' + ERROR_MESSAGES.NETWORK_ERROR,
            });
            return;
          }
        }
      }
      
      set({ 
        error: errorMessage,
        isLoading: false,
        forecast: [],
      });
    }
  },
}));