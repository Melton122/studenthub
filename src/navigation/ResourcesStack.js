import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResourcesScreen from '../screens/resources/ResourcesScreen';
import ResourceDetailScreen from '../screens/resources/ResourceDetailsScreen';
import DownloadsScreen from '../screens/resources/DownloadsScreen';
import SubjectsScreen from '../screens/resources/SubjectsScreen';
import SubjectResourcesScreen from '../screens/resources/SubjectsScreen';

const Stack = createNativeStackNavigator();

export default function ResourcesStack() {
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
        name="ResourcesMain" 
        component={ResourcesScreen} 
        options={{ 
          title: 'Resources',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Subjects" 
        component={SubjectsScreen} 
        options={{ title: 'Subjects' }}
      />
      <Stack.Screen 
        name="SubjectResources" 
        component={SubjectResourcesScreen} 
        options={{ title: 'Resources' }}
      />
      <Stack.Screen 
        name="ResourceDetail" 
        component={ResourceDetailScreen} 
        options={{ title: 'Resource Details' }}
      />
      <Stack.Screen 
        name="Downloads" 
        component={DownloadsScreen} 
        options={{ title: 'My Downloads' }}
      />
    </Stack.Navigator>
  );
}