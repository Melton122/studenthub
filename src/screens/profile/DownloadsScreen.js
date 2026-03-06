import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function DownloadsScreen({ navigation }) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      // In production, load from FileSystem or AsyncStorage
      // For now, use mock data
      const mockDownloads = [
        {
          id: '1',
          title: 'Mathematics Paper 1 - 2023',
          type: 'past_paper',
          subject: 'Mathematics',
          date: '2024-03-15',
          size: '2.4 MB',
          filePath: null,
        },
        {
          id: '2',
          title: 'Physical Sciences Study Notes',
          type: 'notes',
          subject: 'Physical Sciences',
          date: '2024-03-14',
          size: '1.8 MB',
          filePath: null,
        },
        {
          id: '3',
          title: 'Life Sciences Memo - 2023',
          type: 'memo',
          subject: 'Life Sciences',
          date: '2024-03-13',
          size: '1.2 MB',
          filePath: null,
        },
      ];
      setDownloads(mockDownloads);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'notes': return 'document-text';
      case 'past_paper': return 'school';
      case 'memo': return 'checkmark-done';
      case 'video': return 'play-circle';
      default: return 'document';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'notes': return '#6C5CE7';
      case 'past_paper': return '#00B894';
      case 'memo': return '#FDCB6E';
      case 'video': return '#FD79A8';
      default: return '#A29BFE';
    }
  };

  const handleOpenFile = (item) => {
    if (item.filePath) {
      // Open file logic
    } else {
      Alert.alert('Info', 'File not available offline');
    }
  };

  const handleShare = async (item) => {
    try {
      if (item.filePath && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(item.filePath);
      } else {
        Alert.alert('Info', 'File cannot be shared');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete file logic
            setDownloads(prev => prev.filter(d => d.id !== item.id));
          },
        },
      ]
    );
  };

  const renderDownloadItem = ({ item }) => (
    <LinearGradient colors={['#1E2340', '#2D3561']} style={styles.downloadCard}>
      <TouchableOpacity style={styles.cardContent} onPress={() => handleOpenFile(item)}>
        <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Ionicons name={getTypeIcon(item.type)} size={32} color={getTypeColor(item.type)} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.subject}>{item.subject}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.size}>{item.size}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Ionicons name="share-outline" size={20} color="#A29BFE" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={20} color="#FF7675" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E27', '#1E2340']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Downloads</Text>
        <Text style={styles.headerCount}>{downloads.length} files</Text>
      </LinearGradient>

      <FlatList
        data={downloads}
        renderItem={renderDownloadItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-download-outline" size={60} color="#636E72" />
            <Text style={styles.emptyTitle}>No downloads yet</Text>
            <Text style={styles.emptyText}>
              Resources you download will appear here
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Resources')}
            >
              <Text style={styles.browseButtonText}>Browse Resources</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  headerCount: { fontSize: 14, color: '#A29BFE' },
  listContent: { padding: 16 },
  downloadCard: { borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', padding: 16 },
  iconContainer: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  subject: { fontSize: 13, color: '#6C5CE7', marginBottom: 8 },
  metaContainer: { flexDirection: 'row', gap: 12 },
  date: { fontSize: 11, color: '#A29BFE' },
  size: { fontSize: 11, color: '#A29BFE' },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#2D3561' },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#636E72', textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: '#6C5CE7', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  browseButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});