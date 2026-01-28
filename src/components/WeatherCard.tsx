import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { colors } from '../constants/theme';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon 
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    flex: 1,
    margin: 4,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  unit: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    marginLeft: 2,
  },
});