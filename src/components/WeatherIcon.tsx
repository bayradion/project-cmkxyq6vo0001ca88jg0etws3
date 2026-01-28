import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getWeatherIcon } from '../utils/weatherIcons';
import { colors } from '../constants/theme';

interface WeatherIconProps {
  condition: string;
  size?: number;
  color?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 64, 
  color = colors.white 
}) => {
  const iconName = getWeatherIcon(condition);
  
  return (
    <Ionicons 
      name={iconName} 
      size={size} 
      color={color} 
    />
  );
};