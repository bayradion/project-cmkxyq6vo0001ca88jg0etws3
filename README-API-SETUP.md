# OpenWeatherMap API Setup Guide

## ⚠️ IMPORTANT: API Key Configuration Required

The weather application requires a valid OpenWeatherMap API key to function properly. The current API key appears to be invalid or expired.

## Step-by-Step Setup

### 1. Get Your Free API Key

1. **Visit OpenWeatherMap**: Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. **Choose Plan**: Click "Subscribe" under "Current Weather Data" (Free plan: 1,000 calls/day)
3. **Create Account**: Sign up for a new account or sign in if you already have one
4. **Verify Email**: Check your email and verify your account
5. **Get API Key**: 
   - Go to your account dashboard
   - Navigate to "API keys" section
   - Copy your default API key (32-character string)

### 2. Configure Your API Key

1. **Open Configuration File**: Edit `src/constants/weather-api.ts`
2. **Replace API Key**: Find this line:
   ```typescript
   API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE',
   ```
3. **Paste Your Key**: Replace `'YOUR_OPENWEATHER_API_KEY_HERE'` with your actual API key:
   ```typescript
   API_KEY: 'your_actual_32_character_api_key_here',
   ```

### 3. API Key Activation

⏰ **Important**: New API keys may take up to 10 minutes to activate after creation.

If you get authentication errors immediately after setup:
- Wait 10-15 minutes
- Try refreshing the app
- Check the console for detailed error messages

### 4. Verify Setup

The app will automatically:
- ✅ Validate your API key format
- ✅ Test connectivity to OpenWeatherMap
- ✅ Show detailed error messages if issues are found
- ✅ Provide fallback data if network is unavailable

### 5. Troubleshooting

#### Common Issues:

**"Invalid API key" Error:**
- Double-check you copied the entire 32-character key
- Ensure no extra spaces or characters
- Wait 10 minutes if the key was just created
- Verify the key is activated in your OpenWeatherMap dashboard

**"Network connection failed" Error:**
- Check your internet connection
- Try refreshing the page
- The app will show fallback weather data when offline

**"API rate limit exceeded" Error:**
- You've exceeded 1,000 calls per day (free plan)
- Wait until tomorrow or upgrade your plan
- Consider caching data to reduce API calls

#### Debug Information:

The app provides detailed logging in the browser console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for weather-related log messages
4. API key validation results will be shown

### 6. API Key Security

🔒 **Security Notes:**
- Never commit API keys to public repositories
- Consider using environment variables in production
- Monitor your API usage in the OpenWeatherMap dashboard
- Regenerate keys if compromised

### 7. Features Included

With a valid API key, you get:
- ✅ Real-time current weather
- ✅ 5-day weather forecast
- ✅ Multiple cities support
- ✅ Detailed weather metrics (humidity, wind, pressure, etc.)
- ✅ Automatic error handling and retries
- ✅ Offline fallback data

### 8. Support

If you continue experiencing issues:
1. Check the browser console for error details
2. Verify your API key in the OpenWeatherMap dashboard
3. Ensure your internet connection is stable
4. Try with a different city name

For OpenWeatherMap-specific issues, visit their [support documentation](https://openweathermap.org/faq).

---

## Example Configuration

```typescript
// src/constants/weather-api.ts
export const WEATHER_CONFIG = {
  API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Your actual API key here
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_CITY: 'New York',
  UNITS: 'metric',
  // ... other settings
};
```

Replace `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` with your actual OpenWeatherMap API key.