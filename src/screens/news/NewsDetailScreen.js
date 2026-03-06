import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';

export default function NewsDetailScreen({ route, navigation }) {
  const { article } = route.params;
  const [loading, setLoading] = useState(false);

  const handleOpenLink = async () => {
    if (article.url) {
      try {
        setLoading(true);
        await WebBrowser.openBrowserAsync(article.url);
      } catch (error) {
        Linking.openURL(article.url);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.url || 'Read more in Student Hub'}`,
        title: 'Share Article',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
          <LinearGradient
            colors={['rgba(5,7,20,0)', 'rgba(5,7,20,0.6)', '#050714']}
            style={styles.imageOverlay}
          />
          {/* Noise texture overlay */}
          <View style={styles.noiseOverlay} />
        </View>

        {/* Floating Header Controls */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <View style={styles.iconButtonInner}>
              <Ionicons name="arrow-back" size={20} color="#E8E3FF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <View style={styles.iconButtonInner}>
              <Ionicons name="share-outline" size={20} color="#E8E3FF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Source + Time Row */}
          <View style={styles.metaRow}>
            <View style={styles.sourcePill}>
              <View style={[styles.sourceDot, { backgroundColor: article.color || '#8B5CF6' }]} />
              <Text style={styles.sourceText}>{article.source}</Text>
            </View>
            <Text style={styles.timeText}>{article.timeAgo}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Author */}
          {article.author && article.author !== 'Unknown' && (
            <View style={styles.authorRow}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorInitial}>
                  {article.author.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.author}>{article.author}</Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Ionicons name="newspaper-outline" size={16} color="#3D3A6B" />
            <View style={styles.dividerLine} />
          </View>

          {/* Body */}
          <Text style={styles.description}>{article.description}</Text>

          {article.content && article.content !== article.description && (
            <Text style={styles.bodyContent}>{article.content}</Text>
          )}

          {/* Read Full Article CTA */}
          {article.url && (
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleOpenLink}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#7C3AED', '#5B21B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <View style={styles.ctaInner}>
                  {loading ? (
                    <ActivityIndicator color="#E8E3FF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.ctaText}>Read Full Article</Text>
                      <View style={styles.ctaIcon}>
                        <Ionicons name="arrow-forward" size={16} color="#7C3AED" />
                      </View>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['rgba(251,191,36,0.08)', 'rgba(251,191,36,0.03)']}
              style={styles.infoCardGradient}
            >
              <View style={styles.infoCardIcon}>
                <Ionicons name="bulb" size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Stay Informed</Text>
                <Text style={styles.infoCardText}>
                  Check back daily for the latest education news in South Africa.
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050714',
  },
  heroContainer: {
    height: 340,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  noiseOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.04,
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 20,
  },
  iconButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  iconButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12,10,35,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#050714',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124,58,237,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 12,
    color: '#4B4880',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F0EDFF',
    lineHeight: 34,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 13,
    fontWeight: '800',
    color: '#A78BFA',
  },
  author: {
    fontSize: 14,
    color: '#6B6899',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A1836',
  },
  description: {
    fontSize: 16,
    color: '#C4BFEA',
    lineHeight: 27,
    marginBottom: 16,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  bodyContent: {
    fontSize: 15,
    color: '#7874A8',
    lineHeight: 25,
    marginBottom: 16,
  },
  ctaButton: {
    marginTop: 28,
    marginBottom: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaGradient: {
    padding: 18,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EDE9FE',
    letterSpacing: 0.3,
  },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    marginTop: 28,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.15)',
  },
  infoCardGradient: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'flex-start',
    gap: 14,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(251,191,36,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  infoCardText: {
    fontSize: 13,
    color: '#7874A8',
    lineHeight: 19,
  },
});