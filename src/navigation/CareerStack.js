// ─────────────────────────────────────────────────────────────────────────────
// navigation/CareerStack.js
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CareerGuideScreen from '../screens/career/CareerGuideScreen';
import CareersListScreen from '../screens/career/CareersListScreen';
import CareerDetailScreen from '../screens/career/CareerDetailScreen';
import UniversityListScreen from '../screens/career/UniversityListScreen';
import UniversityDetailScreen from '../screens/career/UniversityDetailScreen';
import APSCalculatorScreen from '../screens/career/APSCalculatorScreen';
import FavoritesScreen from '../screens/career/FavoritesScreen';
import UniversityMapScreen from '../screens/career/UniversityMapScreen';

import { SCREENS } from '../constants/NavigationConstants';

const Stack = createNativeStackNavigator();

const HEADER = {
  headerStyle: { backgroundColor: '#0A0E27' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: '700' },
  headerBackTitleVisible: false,
};

export default function CareerStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      
      <Stack.Screen
        name={SCREENS.CAREER.MAIN}
        component={CareerGuideScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SCREENS.CAREER.UNIVERSITIES_LIST}
        component={UniversityListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SCREENS.CAREER.UNIVERSITY_DETAIL}
        component={UniversityDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SCREENS.CAREER.CAREERS_LIST}
        component={CareersListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SCREENS.CAREER.CAREER_DETAIL}
        component={CareerDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SCREENS.CAREER.APS_CALCULATOR}
        component={APSCalculatorScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="UniversityMap"
        component={UniversityMapScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}