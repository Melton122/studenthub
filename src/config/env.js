import Constants from 'expo-constants';

/**
 * Environment variables configuration
 * Validates and provides type-safe access to environment variables
 */

const ENV = {
  development: {
    // Supabase
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaXhudWRwZHhib2JrbHRlem9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjQwMDYsImV4cCI6MjA4NTU0MDAwNn0.24ZNYPQPNMbPuh_pGYWQTQp_XqXv2rcTPgSpHSyNzAY',
    
    // News API
    newsApiKey: process.env.EXPO_PUBLIC_NEWS_API_KEY || 'your-news-api-key',
    newsApiUrl: process.env.EXPO_PUBLIC_NEWS_API_URL || 'https://newsapi.org/v2',
    
    // Universities API
    universityApiUrl: process.env.EXPO_PUBLIC_UNIVERSITY_API_URL || 'http://universities.hipolabs.com',
    
    // App info
    appName: process.env.EXPO_PUBLIC_APP_NAME || 'Student Hub (Dev)',
    appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    appEnv: 'development',
  },
  production: {
    // Supabase
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    
    // News API
    newsApiKey: process.env.EXPO_PUBLIC_NEWS_API_KEY,
    newsApiUrl: process.env.EXPO_PUBLIC_NEWS_API_URL,
    
    // Universities API
    universityApiUrl: process.env.EXPO_PUBLIC_UNIVERSITY_API_URL,
    
    // App info
    appName: process.env.EXPO_PUBLIC_APP_NAME,
    appVersion: process.env.EXPO_PUBLIC_APP_VERSION,
    appEnv: 'production',
  }
};

// Get current environment
const getEnvironment = () => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || 'development';
  return ENV[env] || ENV.development;
};

// Validate required environment variables
const validateEnv = () => {
  const config = getEnvironment();
  const missingVars = [];

  if (!config.supabaseUrl) missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!config.supabaseAnonKey) missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  if (!config.newsApiKey) missingVars.push('EXPO_PUBLIC_NEWS_API_KEY');

  if (missingVars.length > 0 && config.appEnv === 'production') {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    // In production, you might want to throw an error
    // throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  return config;
};

export default validateEnv();