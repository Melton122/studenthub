import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SUBJECTS = [
  'Mathematics',
  'Mathematics Literacy',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Economics',
  'Business Studies',
  'Geography',
  'History',
  'English Home Language',
  'English First Additional',
  'Afrikaans Home Language',
  'Life Orientation',
];

const APS_SCALE = [
  { range: '80–100', points: 7, label: 'Outstanding' },
  { range: '70–79', points: 6, label: 'Meritorious' },
  { range: '60–69', points: 5, label: 'Substantial' },
  { range: '50–59', points: 4, label: 'Adequate' },
  { range: '40–49', points: 3, label: 'Moderate' },
  { range: '30–39', points: 2, label: 'Elementary' },
  { range: '0–29', points: 1, label: 'Not achieved' },
];

function getApsPoints(mark) {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

function getScoreCategory(total) {
  if (total >= 36) return { label: 'Excellent', color: '#34D399', description: 'Qualify for top-tier programs' };
  if (total >= 28) return { label: 'Good', color: '#FBBF24', description: 'Eligible for most degree programs' };
  if (total >= 20) return { label: 'Average', color: '#F472B6', description: 'Eligible for diploma programs' };
  return { label: 'Below Average', color: '#F87171', description: 'Consider foundation courses' };
}

export default function APSCalculatorScreen({ navigation }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [results, setResults] = useState(null);
  const [showScale, setShowScale] = useState(false);

  const addSubject = (subject) => {
    if (selectedSubjects.find(s => s.name === subject)) return; // no duplicates
    if (selectedSubjects.length >= 7) {
      Alert.alert('Limit Reached', 'You can only add up to 7 subjects for APS calculation.');
      return;
    }
    setSelectedSubjects([...selectedSubjects, { name: subject, mark: '' }]);
    setResults(null);
  };

  const removeSubject = (index) => {
    const updated = [...selectedSubjects];
    updated.splice(index, 1);
    setSelectedSubjects(updated);
    setResults(null);
  };

  const updateMark = (index, mark) => {
    const updated = [...selectedSubjects];
    updated[index].mark = mark;
    setSelectedSubjects(updated);
    setResults(null);
  };

  const calculateAPS = () => {
    if (selectedSubjects.length === 0) {
      Alert.alert('No Subjects', 'Please add at least one subject to calculate your APS.');
      return;
    }
    let total = 0;
    let valid = true;
    const breakdown = [];
    selectedSubjects.forEach((s) => {
      const mark = parseInt(s.mark);
      if (isNaN(mark) || mark < 0 || mark > 100) {
        valid = false;
      } else {
        const pts = getApsPoints(mark);
        total += pts;
        breakdown.push({ name: s.name, mark, pts });
      }
    });
    if (!valid) {
      Alert.alert('Invalid Marks', 'Please enter valid marks between 0 and 100 for all subjects.');
      return;
    }
    const max = selectedSubjects.length * 7;
    setResults({ total, max, percentage: Math.round((total / max) * 100), breakdown });
  };

  const scoreInfo = results ? getScoreCategory(results.total) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#0D0B24', '#050714']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#A78BFA" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerEyebrow}>Admissions Tool</Text>
          <Text style={styles.headerTitle}>APS Calculator</Text>
        </View>
        <TouchableOpacity
          style={styles.scaleBtn}
          onPress={() => setShowScale(!showScale)}
        >
          <Ionicons name="information-circle-outline" size={22} color="#A78BFA" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* APS Scale Info */}
        {showScale && (
          <View style={styles.scaleCard}>
            <Text style={styles.scaleTitle}>APS Conversion Scale</Text>
            {APS_SCALE.map((row, i) => (
              <View key={i} style={styles.scaleRow}>
                <View style={styles.scalePts}>
                  <Text style={styles.scalePtsText}>{row.points}</Text>
                </View>
                <Text style={styles.scaleRange}>{row.range}%</Text>
                <Text style={styles.scaleLabel}>{row.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Add Subjects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Add Subjects</Text>
            <Text style={styles.sectionCount}>{selectedSubjects.length}/7</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectChipList}
          >
            {SUBJECTS.map((subject) => {
              const isAdded = selectedSubjects.find(s => s.name === subject);
              return (
                <TouchableOpacity
                  key={subject}
                  style={[styles.addChip, isAdded && styles.addChipAdded]}
                  onPress={() => addSubject(subject)}
                  activeOpacity={0.75}
                >
                  {isAdded ? (
                    <Ionicons name="checkmark" size={13} color="#A78BFA" />
                  ) : (
                    <Ionicons name="add" size={13} color="#4B4880" />
                  )}
                  <Text style={[styles.addChipText, isAdded && styles.addChipTextAdded]}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Subjects / Mark Input */}
        {selectedSubjects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: '#FBBF24' }]} />
              <Text style={styles.sectionTitle}>Enter Your Marks</Text>
            </View>
            <View style={styles.marksCard}>
              {selectedSubjects.map((item, index) => {
                const mark = parseInt(item.mark);
                const pts = !isNaN(mark) && mark >= 0 && mark <= 100 ? getApsPoints(mark) : null;
                return (
                  <View key={index} style={[styles.markRow, index > 0 && styles.markRowBorder]}>
                    <View style={styles.markSubjectInfo}>
                      <Text style={styles.markSubjectName}>{item.name}</Text>
                      {pts !== null && (
                        <Text style={styles.markPtsPreview}>{pts} pts</Text>
                      )}
                    </View>
                    <TextInput
                      style={styles.markInput}
                      placeholder="0–100"
                      placeholderTextColor="#2A2754"
                      keyboardType="numeric"
                      value={item.mark}
                      onChangeText={(text) => updateMark(index, text)}
                      maxLength={3}
                    />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeSubject(index)}
                    >
                      <Ionicons name="close" size={16} color="#4B4880" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Calculate Button */}
        {selectedSubjects.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.calcButton}
              onPress={calculateAPS}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#7C3AED', '#5B21B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.calcButtonGradient}
              >
                <Ionicons name="calculator" size={20} color="#EDE9FE" />
                <Text style={styles.calcButtonText}>Calculate APS Score</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {results && scoreInfo && (
          <View style={styles.section}>
            <View style={styles.resultCard}>
              <LinearGradient
                colors={['#0D0B24', '#120E30']}
                style={styles.resultCardGradient}
              >
                {/* Score Display */}
                <View style={styles.resultScoreBlock}>
                  <View style={styles.resultScoreCircle}>
                    <LinearGradient
                      colors={[scoreInfo.color + '25', scoreInfo.color + '10']}
                      style={styles.resultScoreCircleGradient}
                    >
                      <Text style={[styles.resultScore, { color: scoreInfo.color }]}>
                        {results.total}
                      </Text>
                      <Text style={styles.resultScoreMax}>/{results.max}</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.resultScoreInfo}>
                    <View style={[styles.scoreBadge, { backgroundColor: scoreInfo.color + '18', borderColor: scoreInfo.color + '30' }]}>
                      <Text style={[styles.scoreBadgeText, { color: scoreInfo.color }]}>
                        {scoreInfo.label}
                      </Text>
                    </View>
                    <Text style={styles.scoreDescription}>{scoreInfo.description}</Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[scoreInfo.color, scoreInfo.color + 'BB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${results.percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>{results.percentage}% of maximum</Text>
                </View>

                {/* Breakdown */}
                <View style={styles.breakdownTitle}>
                  <Text style={styles.breakdownTitleText}>Subject Breakdown</Text>
                </View>
                {results.breakdown.map((row, i) => (
                  <View key={i} style={styles.breakdownRow}>
                    <Text style={styles.breakdownSubject} numberOfLines={1}>{row.name}</Text>
                    <Text style={styles.breakdownMark}>{row.mark}%</Text>
                    <View style={[styles.breakdownPts, { backgroundColor: scoreInfo.color + '18' }]}>
                      <Text style={[styles.breakdownPtsText, { color: scoreInfo.color }]}>
                        {row.pts} pts
                      </Text>
                    </View>
                  </View>
                ))}
              </LinearGradient>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: { padding: 4 },
  headerEyebrow: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.7 },
  scaleBtn: { marginLeft: 'auto', padding: 4 },
  scroll: { flex: 1 },

  // Scale Card
  scaleCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#0D0B24',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1A1836',
    gap: 10,
  },
  scaleTitle: { fontSize: 14, fontWeight: '800', color: '#E8E3FF', marginBottom: 4, letterSpacing: -0.2 },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scalePts: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(124,58,237,0.15)', justifyContent: 'center', alignItems: 'center' },
  scalePtsText: { fontSize: 13, fontWeight: '800', color: '#A78BFA' },
  scaleRange: { width: 70, fontSize: 13, color: '#C4BFEA', fontWeight: '600' },
  scaleLabel: { fontSize: 13, color: '#4B4880' },

  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionAccent: { width: 4, height: 20, borderRadius: 2, backgroundColor: '#7C3AED' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.3, flex: 1 },
  sectionCount: { fontSize: 13, fontWeight: '700', color: '#4B4880' },

  subjectChipList: { gap: 8, paddingRight: 20 },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0D0B24',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  addChipAdded: {
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124,58,237,0.1)',
  },
  addChipText: { fontSize: 13, color: '#4B4880', fontWeight: '600' },
  addChipTextAdded: { color: '#A78BFA' },

  marksCard: {
    backgroundColor: '#0D0B24',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  markRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  markRowBorder: { borderTopWidth: 1, borderTopColor: '#1A1836' },
  markSubjectInfo: { flex: 1 },
  markSubjectName: { fontSize: 14, color: '#C4BFEA', fontWeight: '600' },
  markPtsPreview: { fontSize: 11, color: '#7C3AED', fontWeight: '700', marginTop: 2 },
  markInput: {
    width: 72,
    backgroundColor: '#050714',
    color: '#F0EDFF',
    padding: 10,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1A1836',
    justifyContent: 'center',
    alignItems: 'center',
  },

  calcButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  calcButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 18,
  },
  calcButtonText: { fontSize: 16, fontWeight: '700', color: '#EDE9FE', letterSpacing: 0.3 },

  // Results
  resultCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  resultCardGradient: { padding: 24 },
  resultScoreBlock: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 },
  resultScoreCircle: { borderRadius: 50, overflow: 'hidden' },
  resultScoreCircleGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  resultScore: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  resultScoreMax: { fontSize: 16, color: '#3D3A6B', fontWeight: '700', marginTop: 8 },
  resultScoreInfo: { flex: 1, gap: 8 },
  scoreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  scoreBadgeText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.3 },
  scoreDescription: { fontSize: 13, color: '#7874A8', lineHeight: 19 },

  progressContainer: { gap: 6, marginBottom: 24 },
  progressBar: {
    height: 6,
    backgroundColor: '#1A1836',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#4B4880', fontWeight: '500', textAlign: 'right' },

  breakdownTitle: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1836',
    marginBottom: 12,
  },
  breakdownTitleText: { fontSize: 14, fontWeight: '800', color: '#E8E3FF', letterSpacing: -0.2 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  breakdownSubject: { flex: 1, fontSize: 13, color: '#7874A8', fontWeight: '500' },
  breakdownMark: { fontSize: 13, color: '#C4BFEA', fontWeight: '600', width: 42, textAlign: 'right' },
  breakdownPts: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  breakdownPtsText: { fontSize: 12, fontWeight: '800' },
});