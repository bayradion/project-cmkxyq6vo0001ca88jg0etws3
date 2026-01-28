import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import ForecastScreen from './src/screens/ForecastScreen';
import { theme } from './src/constants/theme';

export type RootStackParamList = {
  Home: undefined;
  Forecast: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Forecast" component={ForecastScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}