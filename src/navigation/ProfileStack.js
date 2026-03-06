import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MySessionsScreen from '../screens/profile/MySessionsScreen';
import DownloadsScreen from '../screens/profile/DownloadsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
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
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="MySessions" 
        component={MySessionsScreen} 
        options={{ title: 'My Sessions' }}
      />
      <Stack.Screen 
        name="Downloads" 
        component={DownloadsScreen} 
        options={{ title: 'Downloads' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ title: 'Change Password' }}
      />
    </Stack.Navigator>
  );
}