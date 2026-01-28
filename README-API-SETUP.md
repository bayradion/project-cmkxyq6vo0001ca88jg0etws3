# Weather App API Setup Guide

## Getting Your Free OpenWeatherMap API Key

This weather app uses the OpenWeatherMap API to fetch real-time weather data. You'll need to get a free API key to make the app work properly.

### Step 1: Sign Up for OpenWeatherMap

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click on "Subscribe" under "Current Weather Data" (the free tier allows up to 1,000 API calls per day)
3. Create a new account or sign in if you already have one
4. Complete the registration process

### Step 2: Get Your API Key

1. After signing in, go to your account dashboard
2. Click on the "API Keys" tab
3. You should see a default API key already generated
4. Copy this API key (it will look something like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 3: Configure the App

1. Open the file `src/constants/weather-api.ts`
2. Find the line that says:
   ```typescript
   API_KEY: 'YOUR_API_KEY_HERE',
   ```
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```typescript
   API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
   ```
4. Save the file

### Step 4: Test the App

1. Restart your development server if it's running
2. The app should now be able to fetch real weather data
3. If you see an error, double-check that you've copied the API key correctly

## Important Notes

- **Free Tier Limits**: The free OpenWeatherMap plan allows up to 1,000 API calls per day and 60 calls per minute
- **API Key Activation**: New API keys can take up to 10 minutes to become active
- **Keep Your Key Secure**: Don't share your API key publicly or commit it to version control in production apps

## Troubleshooting

### "Invalid API Key" Error
- Make sure you've replaced `'YOUR_API_KEY_HERE'` with your actual key
- Check that you've copied the key correctly (no extra spaces)
- Wait 10 minutes after creating the key - it needs time to activate

### "Rate Limit Exceeded" Error
- You've made too many requests. Wait a minute and try again
- Consider implementing request caching if you're hitting limits frequently

### "City Not Found" Error
- Try different city names or use more specific locations
- Example: "New York, NY, US" instead of just "New York"

## Alternative Weather APIs

If you prefer to use a different weather service, here are some alternatives:

- **WeatherAPI.com**: Free tier with 1 million calls/month
- **AccuWeather**: Free tier with 50 calls/day
- **OpenWeatherMap One Call API**: More detailed data but requires paid subscription

To switch APIs, you'll need to modify the API endpoints and data parsing in `src/store/weatherStore.ts`.