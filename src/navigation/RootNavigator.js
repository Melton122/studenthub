// navigation/RootNavigator.js

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import AdminPanelScreen from '../screens/admin/AdminPanel';
import { navigationRef } from '../constants/NavigationConstants';
import { StudyProvider } from "../context/StudyContext";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function BootScreen() {
  return (
    <View style={styles.boot}>
      <ActivityIndicator size="large" color="#6C5CE7" />
    </View>
  );
}

function RootNavigator() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        console.warn('[RootNavigator]', e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  if (!appReady || authLoading) return <BootScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ animation: 'fade' }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ animation: 'fade' }}
          />
          {isAdmin && (
            <Stack.Screen
              name="AdminPanel"
              component={AdminPanelScreen}
              options={{
                headerShown: true,
                title: 'Admin Panel',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
                animation: 'slide_from_bottom',
              }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

// ── Wrap RootNavigator in StudyProvider ─────────────────────────────
export default function App() {
  return (
    <StudyProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </StudyProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: '#0A0E27',
    justifyContent: 'center',
    alignItems: 'center',
  },
});