import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STUDY_TOOLS = [
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    description: 'Focus with timed study sessions',
    icon: 'timer-outline',
    screen: 'Pomodoro',
    color: '#6C5CE7',
    gradient: ['#6C5CE7', '#A29BFE'],
  },
  {
    id: 'planner',
    title: 'Study Planner',
    description: 'Plan your study schedule',
    icon: 'calendar-outline',
    screen: 'StudyPlanner',
    color: '#00B894',
    gradient: ['#00B894', '#00E5B4'],
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Create and review flashcards',
    icon: 'flash-outline',
    screen: 'Flashcards',
    color: '#FD79A8',
    gradient: ['#FD79A8', '#FF9FBC'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track your study progress',
    icon: 'analytics-outline',
    screen: 'StudyAnalytics',
    color: '#FDCB6E',
    gradient: ['#FDCB6E', '#FFE08C'],
  },
  {
    id: 'exams',
    title: 'Exam Tracker',
    description: 'Track upcoming exams',
    icon: 'flag-outline',
    screen: 'ExamTracker',
    color: '#FF7675',
    gradient: ['#FF7675', '#FFA0A0'],
  },
  {
    id: 'goals',
    title: 'Study Goals',
    description: 'Set and achieve goals',
    icon: 'flag-outline',
    screen: 'GoalSetting',
    color: '#74B9FF',
    gradient: ['#74B9FF', '#A0D0FF'],
  },
  {
    id: 'reminders',
    title: 'Reminders',
    description: 'Never miss a study session',
    icon: 'notifications-outline',
    screen: 'StudyReminder',
    color: '#AA00FF',
    gradient: ['#AA00FF', '#D07AFF'],
  },
  {
    id: 'session',
    title: 'Study Session',
    description: 'Start a focused session',
    icon: 'play-circle-outline',
    screen: 'StudySession',
    color: '#00CEC9',
    gradient: ['#00CEC9', '#4CFFF9'],
  },
];

export default function StudyToolsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E27', '#1E2340']} style={styles.header}>
        <Text style={styles.headerTitle}>Study Tools</Text>
        <Text style={styles.headerSubtitle}>Everything you need to ace your exams</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.toolsGrid}>
          {STUDY_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => navigation.navigate(tool.screen)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={tool.gradient} style={styles.toolGradient}>
                <Ionicons name={tool.icon} size={32} color="#FFF" />
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <LinearGradient colors={['#1E2340', '#2D3561']} style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FDCB6E" />
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Use the Pomodoro Technique: 25 minutes of focused study, then a 5-minute break. Repeat 4 times, then take a longer break.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#A29BFE', marginTop: 4 },
  content: { padding: 16, paddingBottom: 30 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  toolCard: { width: (width - 44) / 2, height: 160, borderRadius: 16, overflow: 'hidden' },
  toolGradient: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  toolTitle: { fontSize: 14, fontWeight: '700', color: '#FFF', marginTop: 8, textAlign: 'center' },
  toolDescription: { fontSize: 11, color: '#FFF', opacity: 0.9, textAlign: 'center', marginTop: 4 },
  tipCard: { marginTop: 20, padding: 20, borderRadius: 16, alignItems: 'center' },
  tipTitle: { fontSize: 16, fontWeight: '700', color: '#FDCB6E', marginTop: 8, marginBottom: 8 },
  tipText: { fontSize: 13, color: '#A29BFE', textAlign: 'center', lineHeight: 18 },
});