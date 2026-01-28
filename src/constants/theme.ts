import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1',
    accent: '#8b5cf6',
    background: '#1e293b',
    surface: '#334155',
    text: '#ffffff',
    onSurface: '#ffffff',
  },
};

export const weatherGradients = {
  sunny: ['#FFD700', '#FFA500'],
  cloudy: ['#87CEEB', '#4682B4'],
  rainy: ['#4682B4', '#2F4F4F'],
  snowy: ['#E6E6FA', '#B0C4DE'],
  foggy: ['#708090', '#2F4F4F'],
  clear: ['#87CEEB', '#4169E1'],
  default: ['#6366f1', '#8b5cf6'],
};

export const colors = {
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  blue: {
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  purple: {
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
  },
};