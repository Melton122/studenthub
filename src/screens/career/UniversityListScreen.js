import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUniversities } from '../hooks/useUniversities';
import * as Linking from 'expo-linking';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const SORT_OPTIONS = [
  { id: 'name', label: 'Name', icon: 'text' },
  { id: 'country', label: 'Country', icon: 'flag' },
  { id: 'ranking', label: 'Ranking', icon: 'trophy' },
];

const VIEW_MODES = ['grid', 'list'];

export default function UniversityListScreen({ navigation }) {
  const {
    filtered,
    loading,
    error,
    searchQuery,
    selectedCountry,
    sortBy,
    countries,
    handleSearch,
    handleCountryChange,
    handleSortChange,
    refresh,
  } = useUniversities();

  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchFocused, setSearchFocused] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadFavorites();
    Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteUniversities');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) { console.error(e); }
  };

  const toggleFavorite = async (uni) => {
    let newFavs;
    if (favorites.some(f => f.id === uni.id)) {
      newFavs = favorites.filter(f => f.id !== uni.id);
    } else {
      newFavs = [...favorites, uni];
    }
    setFavorites(newFavs);
    await AsyncStorage.setItem('favoriteUniversities', JSON.stringify(newFavs));
  };

  const openWebsite = (url) => {
    if (url) Linking.openURL(url);
    else Alert.alert('No website', 'Website not available.');
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => navigation.navigate('UniversityDetail', { university: item })}
      activeOpacity={0.9}
    >
      <View style={styles.gridImageWrap}>
        <Image source={{ uri: item.logo }} style={styles.gridImage} />
        <LinearGradient colors={['transparent', 'rgba(5,7,20,0.8)']} style={styles.gridOverlay} />
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(item)}>
          <Ionicons
            name={favorites.some(f => f.id === item.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={favorites.some(f => f.id === item.id) ? '#FF7675' : '#FFF'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gridBody}>
        <Text style={styles.gridName}>{item.shortName}</Text>
        <Text style={styles.gridFullName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.gridLocation}>
          <Ionicons name="location" size={12} color="#7C3AED" />
          <Text style={styles.gridLocationText}>{item.country}</Text>
        </View>
        <View style={styles.gridFooter}>
          <View style={styles.gridRank}>
            <Ionicons name="trophy" size={12} color="#FBBF24" />
            <Text style={styles.gridRankText}>#{item.ranking}</Text>
          </View>
          <TouchableOpacity onPress={() => openWebsite(item.webPages[0])}>
            <Ionicons name="globe-outline" size={16} color="#7C3AED" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => navigation.navigate('UniversityDetail', { university: item })}
      activeOpacity={0.8}
    >
      <View style={styles.listIndex}>
        <Text style={styles.listIndexText}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <Image source={{ uri: item.logo }} style={styles.listImage} />
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
        <View style={styles.listLocation}>
          <Ionicons name="location" size={12} color="#7C3AED" />
          <Text style={styles.listLocationText}>{item.country}</Text>
        </View>
        <View style={styles.listMeta}>
          <View style={styles.listPrograms}>
            <Ionicons name="library" size={12} color="#34D399" />
            <Text style={styles.listProgramsText}>{item.programs.length} programs</Text>
          </View>
          <View style={styles.listRank}>
            <Ionicons name="trophy" size={12} color="#FBBF24" />
            <Text style={styles.listRankText}>#{item.ranking}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.listFav} onPress={() => toggleFavorite(item)}>
        <Ionicons
          name={favorites.some(f => f.id === item.id) ? 'heart' : 'heart-outline'}
          size={20}
          color={favorites.some(f => f.id === item.id) ? '#FF7675' : '#3D3A6B'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={{ opacity: headerOpacity }}>
        <LinearGradient colors={['#0D0B24', '#050714']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerEyebrow}>Worldwide</Text>
              <Text style={styles.headerTitle}>Universities</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Favorites')}>
                <Ionicons name="heart" size={22} color="#FF7675" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('UniversityMap')}>
                <Ionicons name="map" size={22} color="#7C3AED" />
              </TouchableOpacity>
              <View style={styles.viewToggle}>
                {VIEW_MODES.map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.viewBtn, viewMode === mode && styles.viewBtnActive]}
                    onPress={() => setViewMode(mode)}
                  >
                    <Ionicons
                      name={mode === 'grid' ? 'grid' : 'list'}
                      size={16}
                      color={viewMode === mode ? '#EDE9FE' : '#3D3A6B'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Find your dream university</Text>
        </LinearGradient>
      </Animated.View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Ionicons name="search" size={18} color={searchFocused ? '#7C3AED' : '#3D3A6B'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, country, program..."
            placeholderTextColor="#3D3A6B"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color="#3D3A6B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Country Filter */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            style={[styles.filterChip, selectedCountry === 'all' && styles.filterChipActive]}
            onPress={() => handleCountryChange('all')}
          >
            <Text style={[styles.filterChipText, selectedCountry === 'all' && styles.filterChipTextActive]}>
              All Countries
            </Text>
          </TouchableOpacity>
          {countries.map(country => (
            <TouchableOpacity
              key={country}
              style={[styles.filterChip, selectedCountry === country && styles.filterChipActive]}
              onPress={() => handleCountryChange(country)}
            >
              <Text style={[styles.filterChipText, selectedCountry === country && styles.filterChipTextActive]}>
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortContent}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.sortChip, sortBy === opt.id && styles.sortChipActive]}
              onPress={() => handleSortChange(opt.id)}
            >
              <Ionicons name={opt.icon} size={12} color={sortBy === opt.id ? '#7C3AED' : '#3D3A6B'} />
              <Text style={[styles.sortChipText, sortBy === opt.id && styles.sortChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count */}
      {!loading && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            <Text style={styles.countNumber}>{filtered.length}</Text> universities found
          </Text>
        </View>
      )}

      {/* Error message if any */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* List/Grid */}
      {loading ? (
        <View style={styles.loadingState}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#7C3AED" />
          </View>
          <Text style={styles.loadingTitle}>Loading universities...</Text>
          <Text style={styles.loadingSubtitle}>Fetching data from around the world</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="school-outline" size={40} color="#3D3A6B" />
          </View>
          <Text style={styles.emptyTitle}>No universities found</Text>
          <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === 'grid' ? (
        <FlatList
          data={filtered}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderListItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerEyebrow: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#F0EDFF', letterSpacing: -0.8 },
  headerSubtitle: { fontSize: 13, color: '#4B4880', fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: '#1A1836',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: { flexDirection: 'row', backgroundColor: '#0D0B24', borderRadius: 10, borderWidth: 1, borderColor: '#1A1836', overflow: 'hidden' },
  viewBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  viewBtnActive: { backgroundColor: 'rgba(124,58,237,0.2)' },
  searchWrap: { paddingHorizontal: 20, paddingVertical: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0B24',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1836',
    gap: 10,
  },
  searchBarFocused: { borderColor: '#7C3AED', backgroundColor: '#0F0D2A' },
  searchInput: { flex: 1, color: '#E8E3FF', fontSize: 14, fontWeight: '500' },
  filterRow: { paddingBottom: 8 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0D0B24',
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  filterChipActive: { borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.1)' },
  filterChipText: { fontSize: 13, color: '#3D3A6B', fontWeight: '600' },
  filterChipTextActive: { color: '#A78BFA' },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 10 },
  sortLabel: { fontSize: 12, color: '#3D3A6B', fontWeight: '600' },
  sortContent: { gap: 6 },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0D0B24',
    borderWidth: 1,
    borderColor: '#1A1836',
  },
  sortChipActive: { borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.1)' },
  sortChipText: { fontSize: 12, color: '#3D3A6B', fontWeight: '600' },
  sortChipTextActive: { color: '#A78BFA' },
  countRow: { paddingHorizontal: 20, paddingBottom: 8 },
  countText: { fontSize: 13, color: '#3D3A6B' },
  countNumber: { fontWeight: '800', color: '#7C3AED' },
  errorContainer: { paddingHorizontal: 20, paddingBottom: 8 },
  errorText: { fontSize: 13, color: '#FF7675', textAlign: 'center' },
  refreshButton: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#7C3AED', borderRadius: 20 },
  refreshText: { color: '#FFF', fontWeight: '700' },

  // Grid
  gridContent: { paddingHorizontal: 16, paddingBottom: 40 },
  gridRow: { justifyContent: 'space-between' },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: '#0D0B24',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1836',
    overflow: 'hidden',
  },
  gridImageWrap: { height: 120, position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  favBtn: { position: 'absolute', top: 8, right: 8, zIndex: 10 },
  gridBody: { padding: 12 },
  gridName: { fontSize: 18, fontWeight: '900', color: '#F0EDFF', letterSpacing: -0.5 },
  gridFullName: { fontSize: 11, color: '#4B4880', marginBottom: 6 },
  gridLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  gridLocationText: { fontSize: 11, color: '#7C3AED', fontWeight: '600' },
  gridFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridRank: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gridRankText: { fontSize: 11, color: '#FBBF24', fontWeight: '700' },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0B24',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1A1836',
    gap: 12,
  },
  listIndex: { width: 28, alignItems: 'center' },
  listIndexText: { fontSize: 12, fontWeight: '800', color: '#2A2754', letterSpacing: 0.5 },
  listImage: { width: 50, height: 50, borderRadius: 12 },
  listInfo: { flex: 1, gap: 4 },
  listName: { fontSize: 15, fontWeight: '700', color: '#E8E3FF' },
  listLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listLocationText: { fontSize: 12, color: '#7C3AED', fontWeight: '600' },
  listMeta: { flexDirection: 'row', gap: 12 },
  listPrograms: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listProgramsText: { fontSize: 11, color: '#34D399', fontWeight: '600' },
  listRank: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listRankText: { fontSize: 11, color: '#FBBF24', fontWeight: '700' },
  listFav: { padding: 4 },

  // States
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingSpinner: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#0D0B24', borderWidth: 1, borderColor: '#1A1836', justifyContent: 'center', alignItems: 'center' },
  loadingTitle: { fontSize: 16, fontWeight: '700', color: '#E8E3FF' },
  loadingSubtitle: { fontSize: 13, color: '#4B4880' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingBottom: 60 },
  emptyIcon: { width: 80, height: 80, borderRadius: 26, backgroundColor: '#0D0B24', borderWidth: 1, borderColor: '#1A1836', justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#E8E3FF' },
  emptyText: { fontSize: 13, color: '#4B4880', textAlign: 'center' },
});