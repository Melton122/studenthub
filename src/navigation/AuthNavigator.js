// navigation/AuthNavigator.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Real auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const Stack = createNativeStackNavigator();
const { width: W, height: H } = Dimensions.get('window');

// Design tokens
const C = {
  bg:       '#0A0E27',
  bgCard:   '#1E2340',
  border:   '#2D3561',
  primary:  '#6C5CE7',
  primary2: '#5048D4',
  textHigh: '#FFFFFF',
  textMid:  '#A29BFE',
  textLow:  '#636E72',
  green:    '#00B894',
  yellow:   '#FDCB6E',
  blue:     '#74B9FF',
};

// Onboarding slides
const SLIDES = [
  {
    id: 1,
    icon: 'book',
    color: C.primary,
    colorSoft: 'rgba(108,92,231,0.14)',
    title: 'Study Smarter',
    subtitle: 'Pomodoro timers, flashcards, study planners and analytics — everything you need to ace your exams.',
  },
  {
    id: 2,
    icon: 'people',
    color: C.green,
    colorSoft: 'rgba(0,184,148,0.14)',
    title: 'Find Expert Tutors',
    subtitle: 'Connect with qualified tutors for 1-on-1 sessions. Book, review, and track progress all in one place.',
  },
  {
    id: 3,
    icon: 'briefcase',
    color: C.yellow,
    colorSoft: 'rgba(253,203,110,0.14)',
    title: 'Plan Your Future',
    subtitle: 'Explore 20+ SA careers, browse university programmes and calculate your APS score instantly.',
  },
];

// Onboarding Screen (inline)
function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);

  // Per-slide animation values
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Entrance (mount) animation
  const mountFade  = useRef(new Animated.Value(0)).current;
  const mountSlide = useRef(new Animated.Value(28)).current;

  // Animated dot widths
  const dotAnims = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 24 : 8))).current;

  // Mount animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(mountFade,  { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.spring(mountSlide, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  // Dot width animation when current changes
  useEffect(() => {
    dotAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === current ? 24 : 8,
        tension: 80,
        friction: 8,
        useNativeDriver: false,
      }).start();
    });
  }, [current]);

  // Cross-fade between slides
  const transitionTo = (nextIndex) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 140, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(nextIndex);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      transitionTo(current + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const slide  = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <View style={obStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={['#12173D', '#0A0E27', '#060A1E']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Soft glow behind icon */}
      <Animated.View
        style={[
          obStyles.glowDisc,
          { backgroundColor: slide.colorSoft, opacity: fadeAnim },
        ]}
      />

      {/* Skip button */}
      <TouchableOpacity
        style={obStyles.skipBtn}
        onPress={() => navigation.replace('Login')}
        hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      >
        <Text style={obStyles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slide content */}
      <Animated.View
        style={[
          obStyles.slideContent,
          {
            opacity: Animated.multiply(mountFade, fadeAnim),
            transform: [{ translateY: mountSlide }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon ring */}
        <View style={[obStyles.iconRing, { borderColor: slide.color + '35' }]}>
          <View style={[obStyles.iconCircle, { backgroundColor: slide.colorSoft }]}>
            <Ionicons name={slide.icon} size={54} color={slide.color} />
          </View>
        </View>

        {/* Step counter */}
        <View style={obStyles.stepRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[obStyles.stepTick, i < current && { backgroundColor: slide.color }]}
            />
          ))}
        </View>

        <Text style={obStyles.title}>{slide.title}</Text>
        <Text style={obStyles.subtitle}>{slide.subtitle}</Text>
      </Animated.View>

      {/* Dot indicators */}
      <View style={obStyles.dotsRow}>
        {SLIDES.map((s, i) => (
          <TouchableOpacity key={s.id} onPress={() => transitionTo(i)}>
            <Animated.View
              style={[
                obStyles.dot,
                {
                  width: dotAnims[i],
                  backgroundColor: i === current ? slide.color : C.border,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <Animated.View style={[obStyles.actions, { opacity: mountFade }]}>
        {/* Primary CTA */}
        <TouchableOpacity
          style={obStyles.primaryBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[C.primary, C.primary2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={obStyles.primaryGradient}
          >
            <Text style={obStyles.primaryText}>
              {isLast ? 'Get Started' : 'Continue'}
            </Text>
            <View style={obStyles.arrowCircle}>
              <Ionicons name="arrow-forward" size={16} color={C.primary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Sign-in link */}
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={obStyles.signinText}>
            Already have an account?{'  '}
            <Text style={obStyles.signinLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Auth Navigator
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.bg },
      }}
      initialRouteName="Onboarding"
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: 'fade' }}
      />
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
    </Stack.Navigator>
  );
}

// Onboarding Styles
const obStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowDisc: {
    position: 'absolute',
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    top: H * 0.06,
    alignSelf: 'center',
  },
  skipBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 44,
    right: 24,
    zIndex: 20,
  },
  skipText: {
    fontSize: 14,
    color: C.textLow,
    fontWeight: '600',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
    width: '100%',
  },
  iconRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  stepTick: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.border,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: C.textHigh,
    textAlign: 'center',
    letterSpacing: -0.7,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: C.textLow,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    maxWidth: 290,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 34,
    gap: 20,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 17,
    paddingHorizontal: 22,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    fontSize: 14,
    color: C.textLow,
    fontWeight: '500',
  },
  signinLink: {
    color: C.textMid,
    fontWeight: '800',
  },
});