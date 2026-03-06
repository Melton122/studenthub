import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchNews, searchNews } from '../../services/api/newsApi';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: '📰', query: 'education South Africa' },
  { id: 'matric', label: 'Matric', icon: '📝', query: 'matric exams NSC results' },
  { id: 'university', label: 'University', icon: '🎓', query: 'university admissions tertiary' },
  { id: 'bursaries', label: 'Bursaries', icon: '💰', query: 'bursaries NSFAS funding' },
  { id: 'career', label: 'Careers', icon: '💼', query: 'career guidance jobs' },
  { id: 'science', label: 'Science', icon: '🔬', query: 'science technology South Africa' },
];

export default function NewsScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const category = CATEGORIES.find(c => c.id === selectedCategory);
      const data = await fetchNews(category.query);
      setArticles(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) { loadNews(); return; }
    try {
      setSearching(true);
      const results = await searchNews(searchQuery);
      setArticles(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadNews(); };

  const renderFeaturedArticle = ({ item, index }) => {
    if (index !== 0) return null;
    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => navigation.navigate('NewsDetail', { article: item })}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(5,7,20,0.5)', '#050714']}
          style={styles.featuredOverlay}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredMeta}>
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LATEST</Text>
              </View>
              <Text style={styles.featuredTime}>{item.timeAgo}</Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.featuredDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.featuredSourceRow}>
              <View style={[styles.featuredSourceBadge, { backgroundColor: (item.color || '#7C3AED') + '25' }]}>
                <Text style={[styles.featuredSourceText, { color: item.color || '#A78BFA' }]}>
                  {item.source}
                </Text>
              </View>
              <View style={styles.readMoreChip}>
                <Text style={styles.readMoreChipText}>Read more</Text>
                <Ionicons name="arrow-forward" size={12} color="#A78BFA" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderArticle = ({ item, index }) => {
    if (index === 0) return renderFeaturedArticle({ item, index });
    return (
      <TouchableOpacity
        style={styles.articleCard}
        onPress={() => navigation.navigate('NewsDetail', { article: item })}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
        <View style={styles.articleBody}>
          <View style={styles.articleTopRow}>
            <View style={[styles.sourceBadge, { backgroundColor: (item.color || '#7C3AED') + '18' }]}>
              <Text style={[styles.sourceText, { color: item.color || '#A78BFA' }]}>{item.source}</Text>
            </View>
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
          <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.articleDesc} numberOfLines={2}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Premium Header */}
      <LinearGradient
        colors={['#0D0B24', '#050714']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerEyebrow}>Student Hub</Text>
            <Text style={styles.headerTitle}>News & Updates</Text>
          </View>
          <View style={styles.headerBadge}>
            <View style={styles.headerBadgeDot} />
            <Text style={styles.headerBadgeText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Stay informed about education in South Africa</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
          <Ionicons name="search" size={18} color={searchFocused ? '#A78BFA' : '#3D3A6B'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#3D3A6B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); loadNews(); }}>
              <Ionicons name="close-circle" size={18} color="#3D3A6B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Chips */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSelectedCategory(cat.id)}
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
                <Text style={styles.chipIcon}>{cat.icon}</Text>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Searching State */}
      {searching && (
        <View style={styles.searchingRow}>
          <ActivityIndicator size="small" color="#7C3AED" />
          <Text style={styles.searchingText}>Searching...</Text>
        </View>
      )}

      {/* Articles List */}
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
        }
        ListEmptyComponent={
          !loading && !searching && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="newspaper-outline" size={40} color="#3D3A6B" />
              </View>
              <Text style={styles.emptyTitle}>No articles found</Text>
              <Text style={styles.emptyText}>Try a different category or search term</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={styles.loadingText}>Loading latest news...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050714',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F0EDFF',
    letterSpacing: -0.8,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    marginTop: 4,
  },
  headerBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#4B4880',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0B24',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1836',
    gap: 10,
  },
  searchContainerFocused: {
    borderColor: '#7C3AED',
    backgroundColor: '#0F0D2A',
  },
  searchInput: {
    flex: 1,
    color: '#E8E3FF',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesWrapper: {
    paddingBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#0D0B24',
    borderWidth: 1,
    borderColor: '#1A1836',
    overflow: 'hidden',
  },
  chipActive: {
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B4880',
  },
  chipTextActive: {
    color: '#EDE9FE',
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  searchingText: {
    fontSize: 13,
    color: '#7874A8',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Featured Card (first article)
  featuredCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
    gap: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(124,58,237,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#A78BFA',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A78BFA',
    letterSpacing: 1.5,
  },
  featuredTime: {
    fontSize: 11,
    color: 'rgba(240,237,255,0.5)',
    fontWeight: '500',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F0EDFF',
    lineHeight: 27,
    letterSpacing: -0.3,
  },
  featuredDesc: {
    fontSize: 13,
    color: 'rgba(240,237,255,0.65)',
    lineHeight: 19,
  },
  featuredSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  featuredSourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featuredSourceText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  readMoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreChipText: {
    fontSize: 12,
    color: '#A78BFA',
    fontWeight: '600',
  },

  // Regular Article Card
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#0D0B24',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1836',
    height: 110,
  },
  articleImage: {
    width: 110,
    height: '100%',
  },
  articleBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  articleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 10,
    color: '#3D3A6B',
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8E3FF',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  articleDesc: {
    fontSize: 12,
    color: '#4B4880',
    lineHeight: 17,
  },

  // States
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#0D0B24',
    borderWidth: 1,
    borderColor: '#1A1836',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8E3FF',
  },
  emptyText: {
    fontSize: 13,
    color: '#3D3A6B',
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#4B4880',
    fontWeight: '500',
  },
});