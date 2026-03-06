import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UniversityDetailScreen({ route, navigation }) {
  const { university } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteUniversities');
      if (stored) {
        const favs = JSON.parse(stored);
        setIsFavorite(favs.some(f => f.id === university.id));
      }
    } catch (e) { console.error(e); }
  };

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteUniversities');
      let favs = stored ? JSON.parse(stored) : [];
      if (isFavorite) {
        favs = favs.filter(f => f.id !== university.id);
      } else {
        favs.push(university);
      }
      await AsyncStorage.setItem('favoriteUniversities', JSON.stringify(favs));
      setIsFavorite(!isFavorite);
    } catch (e) { console.error(e); }
  };

  const openWebsite = () => {
    if (university.webPages && university.webPages[0]) {
      Linking.openURL(university.webPages[0]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: university.logo }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(5,7,20,0.2)', 'rgba(5,7,20,0.55)', '#050714']}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient colors={['rgba(5,7,20,0.6)', 'transparent']} style={styles.topScrim} />
        </View>

        {/* Back & Favorite */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#E8E3FF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF7675' : '#E8E3FF'}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Country */}
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{university.name}</Text>
            <View style={styles.locationRow}>
              <View style={styles.locationPill}>
                <Ionicons name="location-sharp" size={14} color="#A78BFA" />
                <Text style={styles.locationText}>{university.country}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="library-outline" size={20} color="#818CF8" />
              <Text style={styles.statValue}>{university.programs.length}</Text>
              <Text style={styles.statLabel}>Programs</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={20} color="#34D399" />
              <Text style={styles.statValue}>{university.students}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trophy-outline" size={20} color="#FBBF24" />
              <Text style={styles.statValue}>#{university.ranking}</Text>
              <Text style={styles.statLabel}>Ranking</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.description}>{university.description}</Text>
          </View>

          {/* Programs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: '#34D399' }]} />
              <Text style={styles.sectionTitle}>Programs Offered</Text>
            </View>
            <View style={styles.programsGrid}>
              {university.programs.map((program, index) => (
                <View key={index} style={styles.programChip}>
                  <Text style={styles.programText}>{program}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Website */}
          <TouchableOpacity style={styles.websiteButton} onPress={openWebsite}>
            <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.websiteGradient}>
              <Ionicons name="globe-outline" size={20} color="#EDE9FE" />
              <Text style={styles.websiteText}>Visit Official Website</Text>
              <View style={styles.websiteArrow}>
                <Ionicons name="arrow-forward" size={14} color="#7C3AED" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Map Preview */}
          <TouchableOpacity
            style={styles.mapPreview}
            onPress={() => navigation.navigate('UniversityMap', { university })}
          >
            <LinearGradient colors={['#0D0B24', '#050714']} style={styles.mapGradient}>
              <Ionicons name="map" size={24} color="#7C3AED" />
              <Text style={styles.mapText}>View on Map</Text>
              <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
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
  headerActions: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  iconButton: {
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
  titleBlock: { marginBottom: 24 },
  name: { fontSize: 28, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.7, marginBottom: 8 },
  locationRow: { flexDirection: 'row' },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(124,58,237,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  locationText: { fontSize: 13, color: '#A78BFA', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: '#0D0B24',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  statValue: { fontSize: 18, fontWeight: '800', color: '#E8E3FF' },
  statLabel: { fontSize: 11, color: '#4B4880', textAlign: 'center' },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionAccent: { width: 4, height: 22, borderRadius: 2, backgroundColor: '#7C3AED' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#F0EDFF' },
  description: { fontSize: 15, color: '#7874A8', lineHeight: 24 },
  programsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  programChip: {
    backgroundColor: '#0D0B24',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  programText: { fontSize: 13, color: '#A78BFA', fontWeight: '600' },
  websiteButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 },
  websiteGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  websiteText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#EDE9FE', marginLeft: 12 },
  websiteArrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center' },
  mapPreview: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1A1836' },
  mapGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  mapText: { fontSize: 14, fontWeight: '600', color: '#E8E3FF', marginLeft: 8, flex: 1 },
});