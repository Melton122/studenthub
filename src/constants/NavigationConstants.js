// ─────────────────────────────────────────────────────────────────────────────
// navigation/NavigationConstants.js
//
// Single source of truth for every screen name used in navigate() calls.
// Import from here instead of typing string literals anywhere in the app.
//
// Usage:
//   import { TABS, SCREENS } from '../navigation/NavigationConstants';
//   navigation.navigate(TABS.PROFILE);
//   navigation.navigate(TABS.STUDY, { screen: SCREENS.STUDY.POMODORO });
// ─────────────────────────────────────────────────────────────────────────────

// ── Bottom Tab names (must match Tab.Screen name= props exactly) ──────────────
export const TABS = {
  HOME:      'HomeTab',
  STUDY:     'StudyTab',
  RESOURCES: 'ResourcesTab',
  TUTORS:    'TutorsTab',
  PROFILE:   'ProfileTab',
};

// ── Screen names inside each stack ───────────────────────────────────────────
export const SCREENS = {
  // HomeStack
  HOME: {
    MAIN:        'HomeMain',
    NEWS_DETAIL: 'NewsDetail',
    CAREER_STACK: 'CareerStack',
  },

  // StudyStack
  STUDY: {
    TOOLS:     'StudyTools',
    POMODORO:  'Pomodoro',
    PLANNER:   'StudyPlanner',
    FLASHCARDS: 'Flashcards',
    ANALYTICS: 'StudyAnalytics',
    EXAM_TRACKER: 'ExamTracker',
    GOALS:     'GoalSetting',
    REMINDERS: 'StudyReminder',
    SESSION:   'StudySession',
  },

  // ResourcesStack
  RESOURCES: {
    MAIN:             'ResourcesMain',
    SUBJECTS:         'Subjects',
    SUBJECT_RESOURCES: 'SubjectResources',
    RESOURCE_DETAIL:  'ResourceDetail',
    DOWNLOADS:        'Downloads',
  },

  // TutorsStack
  TUTORS: {
    MAIN:          'TutorsMain',
    TUTOR_DETAIL:  'TutorDetail',
    REVIEWS:       'TutorReviews',
    REQUEST:       'RequestTutor',
    BOOKINGS:      'TutorBookings',
  },

  // ProfileStack
  PROFILE: {
    MAIN:            'ProfileMain',
    EDIT:            'EditProfile',
    MY_SESSIONS:     'MySessions',
    DOWNLOADS:       'Downloads',
    SETTINGS:        'Settings',
    CHANGE_PASSWORD: 'ChangePassword',
  },

  // CareerStack (nested inside HomeStack)
  CAREER: {
    MAIN:               'CareerGuideMain',
    UNIVERSITIES_LIST:  'UniversitiesList',
    UNIVERSITY_DETAIL:  'UniversityDetail',
    CAREERS_LIST:       'CareersList',
    CAREER_DETAIL:      'CareerDetail',
    APS_CALCULATOR:     'APSCalculator',
  },
};

// ── Root-level screens (RootNavigator) ───────────────────────────────────────
export const ROOT = {
  AUTH:        'Auth',
  MAIN:        'Main',
  ADMIN_PANEL: 'AdminPanel',
};

// ── Auth screens (AuthNavigator) ─────────────────────────────────────────────
export const AUTH = {
  ONBOARDING: 'Onboarding',
  LOGIN:      'Login',
  SIGNUP:     'Signup',
};

// ─────────────────────────────────────────────────────────────────────────────
// navigationRef  — for imperative navigation outside React components
// ─────────────────────────────────────────────────────────────────────────────
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/** Navigate from anywhere (services, notifications, etc.) */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

/** Go back from anywhere */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Navigate to a tab, optionally to a specific screen inside its stack.
 * @example
 *   navigateToTab(TABS.STUDY, SCREENS.STUDY.POMODORO)
 *   navigateToTab(TABS.PROFILE)
 */
export function navigateToTab(tab, screen, params) {
  if (!navigationRef.isReady()) return;
  if (screen) {
    navigationRef.navigate(tab, { screen, params });
  } else {
    navigationRef.navigate(tab);
  }
}