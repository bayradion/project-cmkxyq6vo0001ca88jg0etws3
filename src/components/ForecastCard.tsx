import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { ForecastDay } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { colors } from '../constants/theme';

interface ForecastCardProps {
  forecast: ForecastDay;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.day}>{forecast.dayName}</Text>
        <WeatherIcon condition={forecast.condition} size={40} />
        <Text style={styles.condition}>{forecast.condition}</Text>
        <View style={styles.temperatureContainer}>
          <Text style={styles.highTemp}>{forecast.high}°</Text>
          <Text style={styles.lowTemp}>{forecast.low}°</Text>
        </View>
        <Text style={styles.precipitation}>{forecast.precipitation}% rain</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    minWidth: 140,
  },
  content: {
    alignItems: 'center',
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  condition: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  highTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  lowTemp: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
  },
  precipitation: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.6,
  },
});