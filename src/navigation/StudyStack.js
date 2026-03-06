import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Study Screens
import StudyToolsScreen from '../screens/study/StudyToolsScreen';
import PomodoroScreen from '../screens/study/PomodoroScreen';
import StudyPlannerScreen from '../screens/study/StudyPlanScreen';
import FlashcardsScreen from '../screens/study/FlashCardsScreen';
import StudyAnalyticsScreen from '../screens/study/StudyAnalyticsScreen';
import ExamTrackerScreen from '../screens/study/ExamTrackerScreen';
import GoalSettingScreen from '../screens/study/GoalSettingScreen';
import StudyReminderScreen from '../screens/study/StudyReminderScreen';
import StudySessionScreen from '../screens/study/StudySessionScreen';

const Stack = createNativeStackNavigator();

export default function StudyStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A0E27' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerBackTitleVisible: false,
        // Fixed headerRight – now correctly navigates to CareerStack inside HomeTab
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('HomeTab', { screen: 'CareerStack' })}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="compass-outline" size={24} color="#6C5CE7" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="StudyTools" 
        component={StudyToolsScreen} 
        options={{ 
          title: 'Study Tools',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Pomodoro" 
        component={PomodoroScreen} 
        options={{ title: 'Pomodoro Timer' }}
      />
      <Stack.Screen 
        name="StudyPlanner" 
        component={StudyPlannerScreen} 
        options={{ title: 'Study Planner' }}
      />
      <Stack.Screen 
        name="Flashcards" 
        component={FlashcardsScreen} 
        options={{ title: 'Flashcards' }}
      />
      <Stack.Screen 
        name="StudyAnalytics" 
        component={StudyAnalyticsScreen} 
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen 
        name="ExamTracker" 
        component={ExamTrackerScreen} 
        options={{ title: 'Exam Tracker' }}
      />
      <Stack.Screen 
        name="GoalSetting" 
        component={GoalSettingScreen} 
        options={{ title: 'Study Goals' }}
      />
      <Stack.Screen 
        name="StudyReminder" 
        component={StudyReminderScreen} 
        options={{ title: 'Reminders' }}
      />
      <Stack.Screen 
        name="StudySession" 
        component={StudySessionScreen} 
        options={{ title: 'Study Session' }}
      />
    </Stack.Navigator>
  );
}