import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TutorsScreen from '../screens/tutors/TutorsScreen';
import TutorDetailScreen from '../screens/tutors/TutorDetailsScreen';
import TutorReviewsScreen from '../screens/tutors/TutorReviewsScreen';
import RequestTutorScreen from '../screens/tutors/RequestTutorScreen';
import TutorBookingsScreen from '../screens/tutors/TutorBookingsScreen';

const Stack = createNativeStackNavigator();

export default function TutorsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A0E27' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="TutorsMain" 
        component={TutorsScreen} 
        options={{ 
          title: 'Tutors',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="TutorDetail" 
        component={TutorDetailScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TutorReviews" 
        component={TutorReviewsScreen} 
        options={{ title: 'Reviews' }}
      />
      <Stack.Screen 
        name="RequestTutor" 
        component={RequestTutorScreen} 
        options={{ title: 'Request Tutor' }}
      />
      <Stack.Screen 
        name="TutorBookings" 
        component={TutorBookingsScreen} 
        options={{ title: 'My Bookings' }}
      />
    </Stack.Navigator>
  );
}