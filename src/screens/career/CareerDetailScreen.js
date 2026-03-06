import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CareerDetailScreen({ route, navigation }) {
  const { career } = route.params;

  const STAT_CONFIG = [
    { icon: 'calculator', color: '#34D399', label: 'Min APS', value: `${career.aps}+` },
    { icon: 'cash', color: '#FBBF24', label: 'Avg Salary', value: career.salary },
    { icon: 'time', color: '#F472B6', label: 'Duration', value: career.duration },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: career.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(5,7,20,0.15)', 'rgba(5,7,20,0.6)', '#050714']}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['rgba(5,7,20,0.6)', 'transparent']}
            style={styles.topScrim}
          />
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={20} color="#E8E3FF" />
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + Category */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{career.category}</Text>
          </View>
          <Text style={styles.title}>{career.title}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {STAT_CONFIG.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.color + '18' }]}>
                  <Ionicons name={stat.icon} size={18} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {career.description && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{career.description}</Text>
            </View>
          )}

          {/* Required Subjects */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionAccent, { backgroundColor: '#34D399' }]} />
              <Text style={styles.sectionTitle}>Required Subjects</Text>
            </View>
            <View style={styles.subjectsList}>
              {career.subjects?.map((subject, index) => (
                <View key={index} style={styles.subjectChip}>
                  <View style={styles.subjectCheck}>
                    <Ionicons name="checkmark" size={11} color="#050714" />
                  </View>
                  <Text style={styles.subjectText}>{subject}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Top Universities */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionAccent, { backgroundColor: '#818CF8' }]} />
              <Text style={styles.sectionTitle}>Top Universities</Text>
            </View>
            <View style={styles.universitiesList}>
              {career.universities?.map((uni, index) => (
                <View key={index} style={styles.universityRow}>
                  <View style={styles.uniIndex}>
                    <Text style={styles.uniIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.universityText}>{uni}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#3D3A6B" />
                </View>
              ))}
            </View>
          </View>

          {/* Career Outlook */}
          <View style={styles.outlookCard}>
            <LinearGradient
              colors={['rgba(52,211,153,0.08)', 'rgba(52,211,153,0.03)']}
              style={styles.outlookGradient}
            >
              <View style={styles.outlookHeader}>
                <View style={styles.outlookIconWrap}>
                  <Ionicons name="trending-up" size={20} color="#34D399" />
                </View>
                <Text style={styles.outlookTitle}>Career Outlook</Text>
              </View>
              <Text style={styles.outlookText}>
                {career.outlook || 'Strong demand expected in South Africa over the next decade. Excellent opportunities for graduates with the right qualifications.'}
              </Text>
            </LinearGradient>
          </View>

          <View style={{ height: 48 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  heroContainer: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  topScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12,10,35,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#050714',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,58,237,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.22)',
    marginBottom: 10,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#A78BFA', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F0EDFF',
    letterSpacing: -0.7,
    marginBottom: 24,
    lineHeight: 36,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#0D0B24',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  statIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2, textAlign: 'center' },
  statLabel: { fontSize: 10, color: '#4B4880', fontWeight: '500', textAlign: 'center' },

  descriptionCard: {
    backgroundColor: '#0D0B24',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  descriptionText: { fontSize: 15, color: '#7874A8', lineHeight: 24 },

  section: { marginBottom: 28 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionAccent: { width: 4, height: 22, borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.3 },

  subjectsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D0B24',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  subjectCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectText: { fontSize: 13, color: '#C4BFEA', fontWeight: '600' },

  universitiesList: { gap: 8 },
  universityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#0D0B24',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  uniIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uniIndexText: { fontSize: 12, fontWeight: '800', color: '#A78BFA' },
  universityText: { flex: 1, fontSize: 14, color: '#C4BFEA', fontWeight: '600' },

  outlookCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.15)',
  },
  outlookGradient: { padding: 20 },
  outlookHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  outlookIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(52,211,153,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlookTitle: { fontSize: 16, fontWeight: '800', color: '#34D399' },
  outlookText: { fontSize: 14, color: '#7874A8', lineHeight: 22 },
});