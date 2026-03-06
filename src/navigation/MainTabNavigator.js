import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// Import stacks
import HomeStack from './HomeStack';
import StudyStack from './StudyStack';
import ResourcesStack from './ResourcesStack';
import TutorsStack from './TutorsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ focused, label, color }) => (
  <Text style={[styles.tabLabel, { color }]}>{label}</Text>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'StudyTab':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'ResourcesTab':
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            case 'TutorsTab':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#636E72',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabel: ({ focused, color }) => {
          const labels = {
            HomeTab: 'Home',
            StudyTab: 'Study',
            ResourcesTab: 'Resources',
            TutorsTab: 'Tutors',
            ProfileTab: 'Profile',
          };
          return <CustomTabBarLabel focused={focused} label={labels[route.name]} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="StudyTab" component={StudyStack} />
      <Tab.Screen name="ResourcesTab" component={ResourcesStack} />
      <Tab.Screen name="TutorsTab" component={TutorsStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1E2340',
    borderTopColor: '#2D3561',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarItem: {
    paddingVertical: 5,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});