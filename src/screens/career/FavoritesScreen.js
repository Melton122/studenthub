import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteUniversities');
      setFavorites(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    const newFavs = favorites.filter(f => f.id !== id);
    setFavorites(newFavs);
    await AsyncStorage.setItem('favoriteUniversities', JSON.stringify(newFavs));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UniversityDetail', { university: item })}
    >
      <Image source={{ uri: item.logo }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.location}>
          <Ionicons name="location" size={12} color="#7C3AED" />
          <Text style={styles.locationText}>{item.country}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFavorite(item.id)}>
        <Ionicons name="heart" size={24} color="#FF7675" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={60} color="#3D3A6B" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>Tap the heart on any university to save it here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: '#0D0B24' },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  list: { padding: 20, paddingTop: 0 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0B24', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1A1836' },
  image: { width: 60, height: 60, borderRadius: 12, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#E8E3FF', marginBottom: 4 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, color: '#7C3AED' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#4B4880', textAlign: 'center', marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});