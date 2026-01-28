# OpenWeatherMap API Setup Guide

## Quick Setup

Your API key has been configured: `e724c58404f238764e1588e742372c34`

The app should now work properly with weather data from OpenWeatherMap.

## What was fixed:

1. **API Key Configuration**: The API key is now properly set in both `WEATHER_CONFIG.API_KEY` and `WEATHER_CONFIG.DEFAULT_PARAMS.appid`

2. **Enhanced Validation**: Improved the `validateApiKey()` function to better detect invalid or placeholder keys

3. **Better Error Handling**: Added more detailed logging to help debug API issues

4. **URL Building**: Fixed the URL construction to properly include the API key in requests

## Testing the API

The app will automatically test your API key when you:
- Launch the app (fetches weather for New York by default)
- Search for a new city
- Pull to refresh the weather data

## API Usage Limits

With the free OpenWeatherMap plan, you get:
- 1,000 API calls per day
- 60 calls per minute
- Access to current weather and 5-day forecast

## Troubleshooting

If you still see "Weather service unavailable":

1. **Check API Key Status**: Make sure your API key is active in your OpenWeatherMap account
2. **Wait for Activation**: New API keys can take up to 2 hours to become active
3. **Check Network**: Ensure you have an internet connection
4. **Check Console**: Look for detailed error messages in the developer console

## API Endpoints Used

- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`

Both endpoints use metric units (Celsius) by default.

## Support

If you continue to experience issues:
1. Verify your API key is active at https://openweathermap.org/api
2. Check the OpenWeatherMap API documentation
3. Ensure you're not exceeding the rate limits