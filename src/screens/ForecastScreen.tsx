import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { useWeatherStore } from '../store/weatherStore';
import { useWeatherBackground } from '../hooks/useWeatherBackground';
import { ForecastCard } from '../components/ForecastCard';
import { colors } from '../constants/theme';

type ForecastScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Forecast'>;

interface ForecastScreenProps {
  navigation: ForecastScreenNavigationProp;
}

const ForecastScreen: React.FC<ForecastScreenProps> = ({ navigation }) => {
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    fetchForecast,
  } = useWeatherStore();

  const gradientColors = useWeatherBackground(currentWeather);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const handleRefresh = () => {
    fetchForecast();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading && forecast.length === 0) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.headerTitle}>5-Day Forecast</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Loading forecast...</Text>
          <Text style={styles.loadingSubText}>Getting 5-day weather data</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.headerTitle}>5-Day Forecast</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={64} color={colors.white} />
          <Text style={styles.errorTitle}>Forecast Unavailable</Text>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.retryButton}>
            <Pressable onPress={handleRefresh} style={styles.retryButtonInner}>
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>5-Day Forecast</Text>
        <View style={styles.headerRight}>
          {isLoading && (
            <ActivityIndicator size="small" color={colors.white} />
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.white}
          />
        }
      >
        {/* Current Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={colors.white} />
          <Text style={styles.location}>{currentWeather?.location}</Text>
        </View>

        {/* Forecast Cards */}
        {forecast.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastContainer}
          >
            {forecast.map((day, index) => (
              <ForecastCard key={`${day.date}-${index}`} forecast={day} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.white} />
            <Text style={styles.noDataText}>No forecast data available</Text>
          </View>
        )}

        {/* Weather Summary */}
        {forecast.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>5-Day Summary</Text>
            <Text style={styles.infoText}>
              Temperature range: {Math.min(...forecast.map(f => f.low))}° to {Math.max(...forecast.map(f => f.high))}°
            </Text>
            <Text style={styles.infoText}>
              {forecast.some(f => f.precipitation > 50) 
                ? 'Rain expected in the coming days.' 
                : forecast.some(f => f.precipitation > 20)
                ? 'Some chance of rain this week.'
                : 'Mostly dry conditions expected.'
              }
            </Text>
            <Text style={styles.infoText}>
              Best day: {forecast.reduce((best, day) => 
                day.high > best.high && day.precipitation < best.precipitation ? day : best
              ).dayName} ({forecast.reduce((best, day) => 
                day.high > best.high && day.precipitation < best.precipitation ? day : best
              ).high}°, {forecast.reduce((best, day) => 
                day.high > best.high && day.precipitation < best.precipitation ? day : best
              ).precipitation}% rain)
            </Text>
          </View>
        )}

        {/* Data Attribution */}
        <View style={styles.attribution}>
          <Text style={styles.attributionText}>
            Forecast data provided by OpenWeatherMap
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    width: 40,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  loadingSubText: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  retryButtonInner: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  location: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  forecastContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noDataText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 6,
  },
  attribution: {
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  attributionText: {
    color: colors.white,
    fontSize: 10,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default ForecastScreen;