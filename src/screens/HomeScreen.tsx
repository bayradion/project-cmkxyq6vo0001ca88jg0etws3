import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { useWeatherStore } from '../store/weatherStore';
import { useWeatherBackground } from '../hooks/useWeatherBackground';
import { WeatherIcon } from '../components/WeatherIcon';
import { WeatherCard } from '../components/WeatherCard';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../constants/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { 
    currentWeather, 
    isLoading, 
    error, 
    fetchWeather 
  } = useWeatherStore();
  
  const gradientColors = useWeatherBackground(currentWeather);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleRefresh = () => {
    fetchWeather();
  };

  const navigateToForecast = () => {
    navigation.navigate('Forecast');
  };

  if (isLoading && !currentWeather) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.white} />
          <Text style={styles.errorText}>{error}</Text>
          <CustomButton title="Retry" onPress={handleRefresh} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={colors.white} />
            <Text style={styles.location}>{currentWeather?.location}</Text>
          </View>
        </View>

        {/* Main Weather Display */}
        <View style={styles.mainWeather}>
          <WeatherIcon condition={currentWeather?.condition || 'sunny'} size={120} />
          <Text style={styles.temperature}>{currentWeather?.temperature}°</Text>
          <Text style={styles.condition}>{currentWeather?.condition}</Text>
          <Text style={styles.feelsLike}>Feels like {currentWeather?.feelsLike}°</Text>
        </View>

        {/* Weather Details Grid */}
        <View style={styles.detailsGrid}>
          <WeatherCard
            title="Humidity"
            value={currentWeather?.humidity || 0}
            unit="%"
            icon={<Ionicons name="water" size={24} color={colors.white} />}
          />
          <WeatherCard
            title="Wind Speed"
            value={currentWeather?.windSpeed || 0}
            unit="km/h"
            icon={<Ionicons name="leaf" size={24} color={colors.white} />}
          />
          <WeatherCard
            title="UV Index"
            value={currentWeather?.uvIndex || 0}
            icon={<Ionicons name="sunny" size={24} color={colors.white} />}
          />
          <WeatherCard
            title="Visibility"
            value={currentWeather?.visibility || 0}
            unit="km"
            icon={<Ionicons name="eye" size={24} color={colors.white} />}
          />
        </View>

        {/* Forecast Button */}
        <View style={styles.forecastButton}>
          <CustomButton
            title="5-Day Forecast"
            onPress={navigateToForecast}
            icon={<Ionicons name="calendar" size={20} color={colors.white} />}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  mainWeather: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    color: colors.white,
    marginTop: 16,
  },
  condition: {
    fontSize: 20,
    color: colors.white,
    marginTop: 8,
    textAlign: 'center',
  },
  feelsLike: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  forecastButton: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});

export default HomeScreen;