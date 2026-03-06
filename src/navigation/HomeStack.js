// ─────────────────────────────────────────────────────────────────────────────
// navigation/HomeStack.js
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen         from '../screens/home/HomeScreen';
import NewsDetailScreen   from '../screens/news/NewsDetailScreen';
import MySubjectsScreen   from '../screens/home/MySubjectsscreen';
import CareerStack        from './CareerStack';
import { SCREENS }        from '../constants/NavigationConstants';

const Stack = createNativeStackNavigator();

const HEADER = {
  headerStyle:            { backgroundColor: '#050714' },
  headerTintColor:        '#F0EDFF',
  headerTitleStyle:       { fontWeight: '700' },
  headerBackTitleVisible: false,
};

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      {/* Home dashboard */}
      <Stack.Screen
        name={SCREENS.HOME.MAIN}
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* My Subjects – navigated from HomeScreen shortcut */}
      <Stack.Screen
        name="MySubjects"
        component={MySubjectsScreen}
        options={{ headerShown: false }}
      />

      {/* News article detail – navigated from news carousel */}
      <Stack.Screen
        name={SCREENS.HOME.NEWS_DETAIL}
        component={NewsDetailScreen}
        options={{ headerShown: false }}
      />

      {/* Career stack – navigated from Quick Actions */}
      <Stack.Screen
        name={SCREENS.HOME.CAREER_STACK}
        component={CareerStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}