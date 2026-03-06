import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabaseConfig';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email,
        password: currentPassword,
      });

      if (signInError) {
        Alert.alert('Error', 'Current password is incorrect');
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Password changed successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E27', '#1E2340']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={60} color="#6C5CE7" />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6C5CE7" />
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor="#636E72"
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={20} color="#636E72" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6C5CE7" />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#636E72"
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons name={showNew ? 'eye-off' : 'eye'} size={20} color="#636E72" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6C5CE7" />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#636E72"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#636E72" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password must:</Text>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'} 
                size={16} 
                color={newPassword.length >= 6 ? '#00B894' : '#636E72'} 
              />
              <Text style={styles.requirementText}>Be at least 6 characters</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.changeButton, loading && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.changeButtonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: { 
    paddingTop: 50, 
    paddingBottom: 20, 
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E2340', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  content: { padding: 20 },
  iconContainer: { alignItems: 'center', marginBottom: 30 },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#A29BFE' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2340',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#2D3561',
  },
  input: { flex: 1, color: '#FFF', fontSize: 15, marginLeft: 10 },
  passwordRequirements: { marginTop: 8, padding: 16, backgroundColor: '#1E2340', borderRadius: 12 },
  requirementsTitle: { fontSize: 14, fontWeight: '600', color: '#FFF', marginBottom: 8 },
  requirementItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  requirementText: { fontSize: 13, color: '#A29BFE' },
  changeButton: { backgroundColor: '#6C5CE7', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  disabledButton: { opacity: 0.7 },
  changeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});