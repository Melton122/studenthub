import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchCareers } from '../../services/api/careersApi';

const SORT_OPTIONS = [
  { id: 'aps_asc', label: 'APS: Low to High' },
  { id: 'aps_desc', label: 'APS: High to Low' },
  { id: 'salary', label: 'Top Salary' },
  { id: 'alpha', label: 'A – Z' },
];

export default function CareersListScreen({ route, navigation }) {
  const { category } = route.params || {};
  const [careers, setCareers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState('aps_asc');

  useEffect(() => { loadCareers(); }, []);
  useEffect(() => { applyFilter(); }, [careers, searchQuery, sortBy]);

  const loadCareers = async () => {
    try {
      setLoading(true);
      const data = await fetchCareers();
      const list = category ? data.filter(c => c.categoryId === category.id || c.category === category.title) : data;
      setCareers(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let list = [...careers];
    if (searchQuery.trim()) {
      list = list.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    list.sort((a, b) => {
      if (sortBy === 'aps_asc') return (a.aps || 0) - (b.aps || 0);
      if (sortBy === 'aps_desc') return (b.aps || 0) - (a.aps || 0);
      if (sortBy === 'alpha') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });
    setFiltered(list);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.careerCard}
      onPress={() => navigation.navigate('CareerDetail', { career: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.careerCardImage} />
      <View style={styles.careerCardBody}>
        <View style={styles.careerCardTop}>
          <View style={styles.apsBadge}>
            <Text style={styles.apsBadgeText}>APS {item.aps}+</Text>
          </View>
          <Text style={styles.careerDuration}>{item.duration}</Text>
        </View>
        <Text style={styles.careerTitle}>{item.title}</Text>
        <Text style={styles.careerCategory}>{item.category}</Text>
        <View style={styles.careerMetaRow}>
          <View style={styles.careerMetaItem}>
            <Ionicons name="cash-outline" size={12} color="#34D399" />
            <Text style={styles.careerMetaSalary}>{item.salary}</Text>
          </View>
          <View style={styles.careerCardArrow}>
            <Ionicons name="arrow-forward" size={14} color="#7C3AED" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#0D0B24', '#050714']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backBtnInner}>
            <Ionicons name="arrow-back" size={20} color="#E8E3FF" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerEyebrow}>{category ? category.title : 'All Careers'}</Text>
          <Text style={styles.headerTitle}>
            {category ? `${category.count} Careers` : 'Browse Careers'}
          </Text>
        </View>
        {category && (
          <View style={[styles.categoryIconWrap, { backgroundColor: category.color + '20' }]}>
            <Ionicons name={category.icon} size={22} color={category.color} />
          </View>
        )}
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Ionicons name="search" size={17} color={searchFocused ? '#A78BFA' : '#3D3A6B'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search careers..."
            placeholderTextColor="#3D3A6B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={17} color="#3D3A6B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortContent}>
          {SORT_OPTIONS.map(opt => {
            const isActive = sortBy === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sortChip, isActive && styles.sortChipActive]}
                onPress={() => setSortBy(opt.id)}
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
                <Text style={[styles.sortChipText, isActive && styles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Count */}
      {!loading && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            <Text style={styles.countNumber}>{filtered.length}</Text>
            {' '}careers found
          </Text>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="briefcase-outline" size={36} color="#3D3A6B" />
              </View>
              <Text style={styles.emptyTitle}>No careers found</Text>
              <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {},
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: '#1A1836',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  headerEyebrow: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#F0EDFF', letterSpacing: -0.5 },
  categoryIconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  searchWrap: { paddingHorizontal: 20, paddingVertical: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0B24',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1836',
    gap: 10,
  },
  searchBarFocused: { borderColor: '#7C3AED' },
  searchInput: { flex: 1, color: '#E8E3FF', fontSize: 14, fontWeight: '500' },

  sortWrap: { paddingBottom: 12 },
  sortContent: { paddingHorizontal: 20, gap: 8 },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0D0B24',
    borderWidth: 1,
    borderColor: '#1A1836',
    overflow: 'hidden',
  },
  sortChipActive: { borderColor: '#7C3AED' },
  sortChipText: { fontSize: 12, color: '#4B4880', fontWeight: '600' },
  sortChipTextActive: { color: '#EDE9FE' },

  countRow: { paddingHorizontal: 20, paddingBottom: 8 },
  countText: { fontSize: 13, color: '#4B4880' },
  countNumber: { fontWeight: '800', color: '#7C3AED' },

  listContent: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },

  careerCard: {
    flexDirection: 'row',
    backgroundColor: '#0D0B24',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1A1836',
    height: 120,
  },
  careerCardImage: { width: 120, height: '100%' },
  careerCardBody: { flex: 1, padding: 14, justifyContent: 'space-between' },
  careerCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  apsBadge: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
  },
  apsBadgeText: { fontSize: 10, fontWeight: '800', color: '#A78BFA', letterSpacing: 0.3 },
  careerDuration: { fontSize: 11, color: '#3D3A6B', fontWeight: '500' },
  careerTitle: { fontSize: 15, fontWeight: '700', color: '#E8E3FF', letterSpacing: -0.2 },
  careerCategory: { fontSize: 11, color: '#7C3AED', fontWeight: '600', letterSpacing: 0.2 },
  careerMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  careerMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  careerMetaSalary: { fontSize: 12, color: '#34D399', fontWeight: '700' },
  careerCardArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { paddingTop: 60, alignItems: 'center', gap: 12 },
  emptyIcon: { width: 72, height: 72, borderRadius: 22, backgroundColor: '#0D0B24', borderWidth: 1, borderColor: '#1A1836', justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#E8E3FF' },
  emptyText: { fontSize: 13, color: '#3D3A6B', textAlign: 'center' },
});