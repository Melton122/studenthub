import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchUniversities } from '../../services/api/universitiesApi';
import { fetchCareers } from '../../services/api/careersApi';

const CAREER_CATEGORIES = [
  { id: 'health', title: 'Health Sciences', icon: 'medical', color: '#F87171', count: 12 },
  { id: 'engineering', title: 'Engineering', icon: 'construct', color: '#818CF8', count: 15 },
  { id: 'commerce', title: 'Commerce', icon: 'cash', color: '#34D399', count: 10 },
  { id: 'law', title: 'Law', icon: 'scale', color: '#F472B6', count: 8 },
  { id: 'it', title: 'IT & Tech', icon: 'laptop', color: '#38BDF8', count: 14 },
  { id: 'education', title: 'Education', icon: 'school', color: '#FBBF24', count: 9 },
  { id: 'science', title: 'Pure Sciences', icon: 'flask', color: '#2DD4BF', count: 11 },
  { id: 'arts', title: 'Creative Arts', icon: 'color-palette', color: '#C084FC', count: 7 },
];

const TABS = [
  { id: 'featured', label: 'Featured', icon: 'star' },
  { id: 'universities', label: 'Universities', icon: 'school' },
  { id: 'careers', label: 'Careers', icon: 'briefcase' },
];

export default function CareerGuideScreen({ navigation }) {
  const [universities, setUniversities] = useState([]);
  const [careers, setCareers] = useState([]);
  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uniData, careerData] = await Promise.all([fetchUniversities(), fetchCareers()]);
      setUniversities(uniData.slice(0, 6));
      setCareers(careerData);
      setFeaturedCareers(careerData.filter(c => c.aps >= 32).slice(0, 4));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CareersList', { category: item })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[item.color + '18', item.color + '08']}
        style={styles.categoryCardGradient}
      >
        <View style={[styles.categoryIconWrap, { backgroundColor: item.color + '22' }]}>
          <Ionicons name={item.icon} size={26} color={item.color} />
        </View>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <View style={styles.categoryCountRow}>
          <Text style={[styles.categoryCount, { color: item.color }]}>{item.count}</Text>
          <Text style={styles.categoryCountLabel}> careers</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderUniversityCard = ({ item }) => (
    <TouchableOpacity
      style={styles.uniCard}
      onPress={() => navigation.navigate('UniversityDetail', { university: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.uniCardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(5,7,20,0.55)', '#050714']}
        style={styles.uniCardOverlay}
      >
        <View style={styles.uniCardContent}>
          <Text style={styles.uniCardShort}>{item.shortName}</Text>
          <Text style={styles.uniCardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.uniCardLocation}>
            <Ionicons name="location-sharp" size={11} color="#A78BFA" />
            <Text style={styles.uniCardLocationText}>{item.location}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCareerCard = ({ item }) => (
    <TouchableOpacity
      style={styles.careerCard}
      onPress={() => navigation.navigate('CareerDetail', { career: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.careerCardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(5,7,20,0.6)', '#050714']}
        style={styles.careerCardOverlay}
      >
        <View style={styles.careerCardContent}>
          <View style={styles.apsBadge}>
            <Text style={styles.apsBadgeText}>APS {item.aps}+</Text>
          </View>
          <Text style={styles.careerCardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.careerCardMeta}>
            <View style={styles.careerCardMetaItem}>
              <Ionicons name="cash-outline" size={11} color="#34D399" />
              <Text style={styles.careerCardMetaText}>{item.salary?.split('/')[0]}</Text>
            </View>
            <View style={styles.careerCardMetaItem}>
              <Ionicons name="time-outline" size={11} color="#FBBF24" />
              <Text style={styles.careerCardMetaText}>{item.duration}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading careers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#0D0B24', '#050714']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerEyebrow}>Explore</Text>
            <Text style={styles.headerTitle}>Career Guide</Text>
          </View>
          <TouchableOpacity
            style={styles.calculatorButton}
            onPress={() => navigation.navigate('APSCalculator')}
          >
            <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.calculatorButtonGradient}>
              <Ionicons name="calculator" size={18} color="#EDE9FE" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Plan your future after matric</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.75}
            >
              {isActive && (
                <LinearGradient
                  colors={['#7C3AED', '#5B21B6']}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons name={tab.icon} size={15} color={isActive ? '#EDE9FE' : '#3D3A6B'} />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* FEATURED TAB */}
        {activeTab === 'featured' && (
          <>
            {/* Categories */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <TouchableOpacity onPress={() => setActiveTab('careers')}>
                  <Text style={styles.seeAll}>See all →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={CAREER_CATEGORIES}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>

            {/* Featured Careers */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Trending Careers</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CareersList')}>
                  <Text style={styles.seeAll}>View all →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={featuredCareers}
                renderItem={renderCareerCard}
                keyExtractor={item => item.id?.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>

            {/* Universities */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎓 Top Universities</Text>
                <TouchableOpacity onPress={() => setActiveTab('universities')}>
                  <Text style={styles.seeAll}>View all →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={universities}
                renderItem={renderUniversityCard}
                keyExtractor={item => item.id?.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>

            {/* APS Banner */}
            <View style={styles.apsBanner}>
              <LinearGradient
                colors={['#4C1D95', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.apsBannerGradient}
              >
                <View style={styles.apsBannerLeft}>
                  <View style={styles.apsBannerIconWrap}>
                    <Ionicons name="calculator" size={24} color="#EDE9FE" />
                  </View>
                  <View>
                    <Text style={styles.apsBannerTitle}>APS Calculator</Text>
                    <Text style={styles.apsBannerSub}>Calculate your Admission Point Score</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.apsBannerBtn}
                  onPress={() => navigation.navigate('APSCalculator')}
                >
                  <Text style={styles.apsBannerBtnText}>Start</Text>
                  <Ionicons name="arrow-forward" size={14} color="#7C3AED" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </>
        )}

        {/* UNIVERSITIES TAB */}
        {activeTab === 'universities' && (
          <View style={styles.section}>
            {universities.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.listCard}
                onPress={() => navigation.navigate('UniversityDetail', { university: item })}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.image }} style={styles.listCardImage} />
                <View style={styles.listCardInfo}>
                  <Text style={styles.listCardTitle}>{item.name}</Text>
                  <View style={styles.listCardLocationRow}>
                    <Ionicons name="location-sharp" size={12} color="#7C3AED" />
                    <Text style={styles.listCardLocation}>{item.location}</Text>
                  </View>
                  <Text style={styles.listCardPrograms} numberOfLines={1}>
                    {item.programs?.slice(0, 3).join(' · ')}
                  </Text>
                </View>
                <View style={styles.listCardChevron}>
                  <Ionicons name="chevron-forward" size={16} color="#3D3A6B" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CAREERS TAB */}
        {activeTab === 'careers' && (
          <View style={styles.section}>
            {careers.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.listCard}
                onPress={() => navigation.navigate('CareerDetail', { career: item })}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.image }} style={styles.listCardImage} />
                <View style={styles.listCardInfo}>
                  <Text style={styles.listCardTitle}>{item.title}</Text>
                  <Text style={styles.listCardCategory}>{item.category}</Text>
                  <View style={styles.listCardMetaRow}>
                    <View style={styles.apsTag}>
                      <Text style={styles.apsTagText}>APS {item.aps}+</Text>
                    </View>
                    <Text style={styles.listCardSalary}>{item.salary}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  loadingScreen: { flex: 1, backgroundColor: '#050714', justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 14, color: '#4B4880', fontWeight: '500' },

  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  headerEyebrow: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.8 },
  headerSubtitle: { fontSize: 13, color: '#4B4880', fontWeight: '500' },
  calculatorButton: { borderRadius: 14, overflow: 'hidden', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  calculatorButtonGradient: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  tabBar: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: 22, backgroundColor: '#0D0B24', borderWidth: 1, borderColor: '#1A1836', overflow: 'hidden' },
  tabItemActive: { borderColor: '#7C3AED', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#3D3A6B' },
  tabTextActive: { color: '#EDE9FE' },

  scrollContent: { paddingBottom: 20 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, color: '#7C3AED', fontWeight: '600' },
  horizontalList: { gap: 12, paddingRight: 20 },

  // Category Card
  categoryCard: { width: 120, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#1A1836' },
  categoryCardGradient: { padding: 16, alignItems: 'center', gap: 8, minHeight: 130 },
  categoryIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  categoryTitle: { fontSize: 13, fontWeight: '700', color: '#E8E3FF', textAlign: 'center' },
  categoryCountRow: { flexDirection: 'row', alignItems: 'center' },
  categoryCount: { fontSize: 16, fontWeight: '800' },
  categoryCountLabel: { fontSize: 12, color: '#4B4880' },

  // University Card
  uniCard: { width: 200, height: 160, borderRadius: 20, overflow: 'hidden' },
  uniCardImage: { width: '100%', height: '100%', position: 'absolute' },
  uniCardOverlay: { flex: 1, justifyContent: 'flex-end' },
  uniCardContent: { padding: 14, gap: 2 },
  uniCardShort: { fontSize: 22, fontWeight: '900', color: '#F0EDFF', letterSpacing: -0.5 },
  uniCardName: { fontSize: 11, color: 'rgba(240,237,255,0.6)', fontWeight: '500' },
  uniCardLocation: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  uniCardLocationText: { fontSize: 11, color: '#A78BFA', fontWeight: '500' },

  // Career Card
  careerCard: { width: 240, height: 170, borderRadius: 20, overflow: 'hidden' },
  careerCardImage: { width: '100%', height: '100%', position: 'absolute' },
  careerCardOverlay: { flex: 1, justifyContent: 'flex-end' },
  careerCardContent: { padding: 14, gap: 6 },
  apsBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(124,58,237,0.85)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  apsBadgeText: { fontSize: 10, fontWeight: '800', color: '#EDE9FE', letterSpacing: 0.5 },
  careerCardTitle: { fontSize: 16, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.2 },
  careerCardMeta: { flexDirection: 'row', gap: 12 },
  careerCardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  careerCardMetaText: { fontSize: 11, color: '#E8E3FF', fontWeight: '600' },

  // APS Banner
  apsBanner: { marginHorizontal: 20, marginTop: 28, borderRadius: 20, overflow: 'hidden', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  apsBannerGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  apsBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  apsBannerIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  apsBannerTitle: { fontSize: 16, fontWeight: '800', color: '#EDE9FE' },
  apsBannerSub: { fontSize: 12, color: 'rgba(237,233,254,0.65)', marginTop: 2 },
  apsBannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EDE9FE', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  apsBannerBtnText: { fontSize: 13, fontWeight: '700', color: '#5B21B6' },

  // List Cards
  listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0B24', borderRadius: 18, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1A1836', gap: 14 },
  listCardImage: { width: 64, height: 64, borderRadius: 14 },
  listCardInfo: { flex: 1, gap: 4 },
  listCardTitle: { fontSize: 15, fontWeight: '700', color: '#E8E3FF', letterSpacing: -0.2 },
  listCardLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  listCardLocation: { fontSize: 12, color: '#7C3AED', fontWeight: '600' },
  listCardPrograms: { fontSize: 12, color: '#3D3A6B' },
  listCardChevron: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1A1836', justifyContent: 'center', alignItems: 'center' },
  listCardCategory: { fontSize: 12, color: '#7C3AED', fontWeight: '600' },
  listCardMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  apsTag: { backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)' },
  apsTagText: { fontSize: 11, fontWeight: '700', color: '#FBBF24' },
  listCardSalary: { fontSize: 12, color: '#34D399', fontWeight: '600' },
});