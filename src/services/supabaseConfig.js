import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// For development/testing - you can hardcode temporarily to verify it works
// Once confirmed working, switch back to environment variables
const supabaseUrl = 'https://usixnudpdxbobkltezoo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaXhudWRwZHhib2JrbHRlem9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjQwMDYsImV4cCI6MjA4NTU0MDAwNn0.24ZNYPQPNMbPuh_pGYWQTQp_XqXv2rcTPgSpHSyNzAY';

// Validation
if (!supabaseUrl) {
  throw new Error('Missing supabaseUrl');
}

if (!supabaseAnonKey) {
  throw new Error('Missing supabaseAnonKey');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});