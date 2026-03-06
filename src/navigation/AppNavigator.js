import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import MainTabNavigator from './MainTabNavigator';

// Auth Screens - Import directly since you don't have AuthNavigator
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Resource Screens
import ResourceDetailsScreen from '../screens/resources/ResourceDetailsScreen';
import DownloadsScreen from '../screens/resources/DownloadsScreen';
import SubjectsScreen from '../screens/resources/SubjectsScreen';
import ResourcesScreen from '../screens/resources/ResourcesScreen';

// Tutor Screens
import TutorDetailsScreen from '../screens/tutors/TutorDetailsScreen';
import TutorSessionsScreen from '../screens/tutors/TutorSessionsScreen';
import TutorReviewsScreen from '../screens/tutors/TutorReviewsScreen';
import RequestTutorScreen from '../screens/tutors/RequestTutorScreen';
import TutorBookingsScreen from '../screens/tutors/TutorBookingsScreen';

// Profile Screens
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MySessionsScreen from '../screens/profile/MySessionsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

// Admin Screens
import AdminPanel from '../screens/admin/AdminPanel';

// Study Screens
import StudyTipsScreen from '../screens/study/StudyTipsScreen';

const Stack = createNativeStackNavigator();

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E27' }}>
    <ActivityIndicator size="large" color="#6C5CE7" />
  </View>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0E27' }
        }}
      >
        {!user ? (
          // Auth Screens - User not logged in
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen 
              name="Signup" 
              component={SignupScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : (
          // Main App - User logged in
          <>
            {/* Main Tab Navigator */}
            <Stack.Screen 
              name="Main" 
              component={MainTabNavigator}
              options={{ animation: 'fade' }}
            />

            {/* ============================================================
                RESOURCE SCREENS
            ============================================================ */}
            <Stack.Screen
              name="ResourceDetails"
              component={ResourceDetailsScreen}
              options={{ 
                headerShown: true, 
                title: 'Resource Details',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="Downloads"
              component={DownloadsScreen}
              options={{ 
                headerShown: true, 
                title: 'My Downloads',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="Subjects"
              component={SubjectsScreen}
              options={{ 
                headerShown: true, 
                title: 'Subjects',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="Resources"
              component={ResourcesScreen}
              options={{ 
                headerShown: true, 
                title: 'Resources',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />

            {/* ============================================================
                TUTOR SCREENS
            ============================================================ */}
            <Stack.Screen
              name="TutorDetails"
              component={TutorDetailsScreen}
              options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            
            <Stack.Screen
              name="TutorSessions"
              component={TutorSessionsScreen}
              options={{ 
                headerShown: true, 
                title: 'Available Sessions',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="TutorReviews"
              component={TutorReviewsScreen}
              options={{ 
                headerShown: true, 
                title: 'Reviews',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="RequestTutor"
              component={RequestTutorScreen}
              options={{ 
                headerShown: true, 
                title: 'Request Tutor',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="TutorBookings"
              component={TutorBookingsScreen}
              options={{ 
                headerShown: true, 
                title: 'My Bookings',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />

            {/* ============================================================
                PROFILE SCREENS
            ============================================================ */}
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ 
                headerShown: true, 
                title: 'Edit Profile',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="MySessions"
              component={MySessionsScreen}
              options={{ 
                headerShown: true, 
                title: 'My Sessions',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ 
                headerShown: true, 
                title: 'Settings',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />

            {/* ============================================================
                ADMIN SCREENS
            ============================================================ */}
            <Stack.Screen
              name="AdminPanel"
              component={AdminPanel}
              options={{ 
                headerShown: false,
              }}
            />

            {/* ============================================================
                STUDY SCREENS
            ============================================================ */}
            <Stack.Screen
              name="StudyTips"
              component={StudyTipsScreen}
              options={{ 
                headerShown: true, 
                title: 'Study Tips',
                headerStyle: { backgroundColor: '#0A0E27' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}