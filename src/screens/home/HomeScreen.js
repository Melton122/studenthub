// screens/home/HomeScreen.js
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, RefreshControl, FlatList,
  ActivityIndicator, StatusBar, Animated, Platform, Alert,
} from 'react-native';
import { Ionicons }       from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { supabase }       from '../../services/supabaseConfig';
import { useAuth }        from '../../context/AuthContext';
import { fetchNews }      from '../../services/api/newsApi';

// ── optional push notifications (expo-notifications) ─────────────────────────
let Notifications = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge:  true,
    }),
  });
} catch (_) {}

const { width } = Dimensions.get('window');
const MATRIC_MS = new Date(2026, 9, 30).getTime(); // 30 Oct 2026

const QUICK_ACTIONS = [
  {
    id: 'study',
    icon: 'book-outline',
    label: 'Study Tools',
    targetTab: 'StudyTab',
    targetScreen: 'StudyTools',
    colors: ['#7C3AED', '#5B21B6'],
    description: 'Pomodoro · Planner · Flashcards',
  },
  {
    id: 'career',
    icon: 'compass-outline',
    label: 'Career Guide',
    targetTab: 'HomeTab',
    targetScreen: 'CareerStack',
    colors: ['#065F46', '#047857'],
    description: 'Universities · Careers · APS',
  },
  {
    id: 'resources',
    icon: 'folder-open-outline',
    label: 'Resources',
    targetTab: 'ResourcesTab',
    targetScreen: undefined,
    colors: ['#7E1D4E', '#9D174D'],
    description: 'Notes · Past Papers · Videos',
  },
  {
    id: 'tutors',
    icon: 'people-outline',
    label: 'Tutors',
    targetTab: 'TutorsTab',
    targetScreen: undefined,
    colors: ['#92400E', '#B45309'],
    description: 'Find & contact tutors',
  },
];

const NEWS_CATEGORIES = [
  { id: 'education', label: '📚 Education', query: 'education South Africa' },
  { id: 'matric',    label: '📝 Matric',    query: 'matric exams NSC'       },
  { id: 'university',label: '🎓 University', query: 'university admissions'  },
  { id: 'bursaries', label: '💰 Bursaries', query: 'bursaries NSFAS'        },
];

const QUOTES = [
  { q:'Education is the most powerful weapon you can use to change the world.', a:'Nelson Mandela' },
  { q:"It always seems impossible until it's done.", a:'Nelson Mandela' },
  { q:'The future belongs to those who believe in the beauty of their dreams.', a:'Eleanor Roosevelt' },
  { q:'Success is not final, failure is not fatal — it is the courage to continue that counts.', a:'Winston Churchill' },
  { q:"Don't watch the clock; do what it does. Keep going.", a:'Sam Levenson' },
  { q:'The secret of getting ahead is getting started.', a:'Mark Twain' },
];

const NOTIF_ICONS = {
  exam:     { icon:'document-text-outline', color:'#EF4444' },
  goal:     { icon:'checkmark-circle-outline', color:'#10B981' },
  session:  { icon:'timer-outline', color:'#7C3AED' },
  resource: { icon:'folder-outline', color:'#F59E0B' },
  tutor:    { icon:'people-outline', color:'#3B82F6' },
  system:   { icon:'notifications-outline', color:'#7874A8' },
};

// ── helpers ───────────────────────────────────────────────────────────────────
const greet = () => {
  const h = new Date().getHours();
  if (h < 5)  return 'Good Night 🌙';
  if (h < 12) return 'Good Morning ☀️';
  if (h < 17) return 'Good Afternoon 🌤';
  return 'Good Evening 🌆';
};

const tick = (ms) => {
  const d = ms - Date.now();
  if (d <= 0) return { days:0, hours:0, min:0, sec:0 };
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d % 86400000) / 3600000),
    min:  Math.floor((d % 3600000) / 60000),
    sec:  Math.floor((d % 60000)   / 1000),
  };
};

const fmtMins = (m) => {
  if (!m) return '0h';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
};

const relTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { user, profile } = useAuth();

  // ── state ──────────────────────────────────────────────────────────────────
  const [loading,         setLoading]         = useState(true);
  const [refreshing,      setRefreshing]       = useState(false);
  const [profileRow,      setProfileRow]       = useState(null);
  const [stats,           setStats]            = useState({ totalMins:0, weekMins:0, streak:0, subjects:0, todaySessions:0 });
  const [goals,           setGoals]            = useState({ done:0, total:0 });
  const [exams,           setExams]            = useState([]);
  const [announcements,   setAnnouncements]    = useState([]);
  const [announcIdx,      setAnnouncIdx]       = useState(0);
  const [notifications,   setNotifications]    = useState([]);
  const [unread,          setUnread]           = useState(0);
  const [notifOpen,       setNotifOpen]        = useState(false);
  const [news,            setNews]             = useState([]);
  const [newsLoading,     setNewsLoading]      = useState(false);
  const [newsCat,         setNewsCat]          = useState('education');
  const [newsIdx,         setNewsIdx]          = useState(0);
  const [countdown,       setCountdown]        = useState(tick(MATRIC_MS));
  const [quoteIdx]                             = useState(() => Math.floor(Math.random() * QUOTES.length));

  // ── refs ───────────────────────────────────────────────────────────────────
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const notifY     = useRef(new Animated.Value(-500)).current;
  const newsRef    = useRef(null);
  const newsTimer  = useRef(null);
  const annTimer   = useRef(null);
  const rtRef      = useRef(null);

  // ── animations on mount ────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue:1, duration:700, useNativeDriver:true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.02, duration:1600, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,    duration:1600, useNativeDriver:true }),
    ])).start();
  }, []);

  // ── countdown tick ─────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setCountdown(tick(MATRIC_MS)), 1000);
    return () => clearInterval(id);
  }, []);

  // ── announcement auto-scroll ───────────────────────────────────────────────
  useEffect(() => {
    clearInterval(annTimer.current);
    if (announcements.length > 1) {
      annTimer.current = setInterval(() =>
        setAnnouncIdx(p => (p + 1) % announcements.length), 5000);
    }
    return () => clearInterval(annTimer.current);
  }, [announcements]);

  // ── news auto-scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(newsTimer.current);
    if (news.length > 1) {
      newsTimer.current = setInterval(() => {
        setNewsIdx(p => {
          const n = (p + 1) % news.length;
          try { newsRef.current?.scrollToIndex({ index:n, animated:true }); } catch(_) {}
          return n;
        });
      }, 5000);
    }
    return () => clearInterval(newsTimer.current);
  }, [news]);

  // ── notification panel slide ───────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(notifY, {
      toValue:  notifOpen ? 0 : -520,
      tension:  80, friction: 12,
      useNativeDriver: true,
    }).start();
  }, [notifOpen]);

  // ── realtime subscriptions ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    rtRef.current = supabase.channel(`home_rt_${user.id}`)
      .on('postgres_changes',{ event:'*', schema:'public', table:'user_profiles',   filter:`id=eq.${user.id}`      }, handleProfileChange)
      .on('postgres_changes',{ event:'*', schema:'public', table:'study_sessions',  filter:`user_id=eq.${user.id}` }, handleStudyChange)
      .on('postgres_changes',{ event:'*', schema:'public', table:'user_subjects',   filter:`user_id=eq.${user.id}` }, handleSubjectChange)
      .on('postgres_changes',{ event:'*', schema:'public', table:'study_goals',     filter:`user_id=eq.${user.id}` }, handleGoalChange)
      .on('postgres_changes',{ event:'*', schema:'public', table:'exams',           filter:`user_id=eq.${user.id}` }, handleExamChange)
      .on('postgres_changes',{ event:'*', schema:'public', table:'notifications',   filter:`user_id=eq.${user.id}` }, handleNotifChange)
      .on('postgres_changes',{ event:'*', schema:'public', table:'announcements'                                   }, () => loadAnnouncements())
      .subscribe();
    return () => supabase.removeChannel(rtRef.current);
  }, [user]);

  const handleProfileChange = ({ new: row }) => { if (row) setProfileRow(row); };
  const handleStudyChange   = () => loadStats();
  const handleSubjectChange = () => loadStats();
  const handleGoalChange    = () => loadGoals();
  const handleExamChange    = () => loadExams();
  const handleNotifChange   = ({ new: row, eventType }) => {
    if (eventType === 'INSERT' && row) {
      setNotifications(p => [row, ...p]);
      if (!row.is_read) {
        setUnread(p => p + 1);
        scheduleLocalPush(row.title, row.message);
      }
    } else {
      loadNotifications();
    }
  };

  // ── focus reload ───────────────────────────────────────────────────────────
  useFocusEffect(useCallback(() => {
    loadAll();
  }, [user]));

  // ── news on category change ────────────────────────────────────────────────
  useEffect(() => { loadNews(); }, [newsCat]);

  // ── push notification setup ────────────────────────────────────────────────
  useEffect(() => {
    if (!Notifications || !user) return;
    (async () => {
      try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let final = existing;
        if (existing !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          final = status;
        }
        if (final !== 'granted') return;
        const { data: token } = await Notifications.getExpoPushTokenAsync();
        if (token) {
          await supabase
            .from('user_profiles')
            .update({ push_token: token })
            .eq('id', user.id);
        }
      } catch (_) {}
    })();
  }, [user]);

  const scheduleLocalPush = async (title, body) => {
    if (!Notifications) return;
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: null,
      });
    } catch (_) {}
  };

  // ── data loaders ───────────────────────────────────────────────────────────
  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    await Promise.allSettled([
      loadProfile(),
      loadStats(),
      loadGoals(),
      loadExams(),
      loadAnnouncements(),
      loadNotifications(),
    ]);
    setLoading(false);
    setRefreshing(false);
  };

  const loadProfile = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('full_name, school_name, grade, province, avatar_url, study_streak')
      .eq('id', user.id)
      .single();
    if (data) setProfileRow(data);
  };

  const loadStats = async () => {
    try {
      const now      = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const weekAgo  = new Date(now.getTime() - 7 * 86400000).toISOString();

      const [sessRes, subRes, profRes] = await Promise.all([
        supabase.from('study_sessions').select('duration_minutes, created_at').eq('user_id', user.id),
        supabase.from('user_subjects').select('id', { count:'exact', head:false }).eq('user_id', user.id),
        supabase.from('user_profiles').select('study_streak').eq('id', user.id).single(),
      ]);

      const sessions    = sessRes.data || [];
      const totalMins   = sessions.reduce((a, s) => a + (s.duration_minutes || 0), 0);
      const weekMins    = sessions
        .filter(s => s.created_at >= weekAgo)
        .reduce((a, s) => a + (s.duration_minutes || 0), 0);
      const todaySessions = sessions.filter(s => s.created_at?.startsWith(todayStr)).length;

      setStats({
        totalMins,
        weekMins,
        streak:        profRes.data?.study_streak || 0,
        subjects:      subRes.data?.length || 0,
        todaySessions,
      });
    } catch (e) { console.warn('loadStats', e); }
  };

  const loadGoals = async () => {
    const { data } = await supabase
      .from('study_goals')
      .select('is_completed')
      .eq('user_id', user.id);
    if (data) setGoals({ done: data.filter(g => g.is_completed).length, total: data.length });
  };

  const loadExams = async () => {
    const { data } = await supabase
      .from('exams')
      .select('*')
      .eq('user_id', user.id)
      .gte('exam_date', new Date().toISOString())
      .order('exam_date', { ascending:true })
      .limit(4);
    setExams(data || []);
  };

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending:false })
      .limit(6);
    setAnnouncements(data || []);
  };

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending:false })
      .limit(25);
    setNotifications(data || []);
    setUnread(data?.filter(n => !n.is_read).length || 0);
  };

  const loadNews = async () => {
    setNewsLoading(true);
    try {
      const cat  = NEWS_CATEGORIES.find(c => c.id === newsCat);
      const data = await fetchNews(cat.query);
      setNews(data || []);
      setNewsIdx(0);
    } catch (_) {
    } finally { setNewsLoading(false); }
  };

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read:true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setNotifications(p => p.map(n => ({ ...n, is_read:true })));
    setUnread(0);
  };

  const onRefresh = () => { setRefreshing(true); loadAll(); loadNews(); };

  // ── computed ───────────────────────────────────────────────────────────────
  const firstName  = profileRow?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'Student';
  const initial    = (profileRow?.full_name || profile?.full_name || 'S').charAt(0).toUpperCase();
  const school     = profileRow?.school_name || '';   // used for location
  const grade      = profileRow?.grade;
  const quote      = QUOTES[quoteIdx];
  const goalPct    = goals.total > 0 ? Math.round((goals.done / goals.total) * 100) : 0;

  // For today's goal progress (example: 25m out of 2h goal – we need a goal to compare)
  // We'll use the first active goal's target hours if available
  const todayGoalMinutes = 120; // default 2h if no goal
  const todayProgress = Math.min(stats.weekMins, todayGoalMinutes); // just for demo, replace with actual today's goal progress

  // ── sub-components ─────────────────────────────────────────────────────────
  const StatTile = ({ icon, value, label, color }) => (
    <View style={styles.statTile}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.statTileValue}>{value}</Text>
      <Text style={styles.statTileLabel}>{label}</Text>
    </View>
  );

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <LinearGradient colors={['#7C3AED','#4C1D95']} style={styles.loaderIcon}>
          <Ionicons name="school-outline" size={32} color="#EDE9FE" />
        </LinearGradient>
        <ActivityIndicator color="#7C3AED" style={{ marginTop:20 }} />
        <Text style={styles.loaderText}>Loading your dashboard…</Text>
      </View>
    );
  }

  // ═══════════════════════════ RENDER ════════════════════════════════════════
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ══════════ NOTIFICATION PANEL (pro styling, closable) ══════════ */}
      {notifOpen && (
        <TouchableOpacity
          style={styles.notifBackdrop}
          activeOpacity={1}
          onPress={() => setNotifOpen(false)}
        />
      )}
      <Animated.View style={[styles.notifPanel, { transform:[{ translateY: notifY }] }]}>
        <View style={styles.notifHandle} />
        <View style={styles.notifHeader}>
          <View>
            <Text style={styles.notifTitle}>Notifications</Text>
            {unread > 0 && (
              <Text style={styles.notifSubtitle}>{unread} unread</Text>
            )}
          </View>
          <View style={styles.notifHeaderRight}>
            {unread > 0 && (
              <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
                <Text style={styles.markReadText}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.notifCloseBtn}
              onPress={() => setNotifOpen(false)}
            >
              <Ionicons name="close" size={18} color="#7874A8" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight:380 }}>
          {notifications.length === 0 ? (
            <View style={styles.notifEmpty}>
              <Ionicons name="notifications-off-outline" size={40} color="#3D3A6B" />
              <Text style={styles.notifEmptyTitle}>All caught up!</Text>
              <Text style={styles.notifEmptyText}>No notifications yet</Text>
            </View>
          ) : notifications.map(n => {
            const ic = NOTIF_ICONS[n.notification_type] || NOTIF_ICONS.system;
            return (
              <TouchableOpacity
                key={n.id}
                style={[styles.notifItem, !n.is_read && styles.notifItemUnread]}
                onPress={async () => {
                  await supabase.from('notifications').update({ is_read:true }).eq('id', n.id);
                  setNotifications(p => p.map(x => x.id === n.id ? { ...x, is_read:true } : x));
                  setUnread(p => Math.max(0, p - (n.is_read ? 0 : 1)));
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.notifItemIcon, { backgroundColor: ic.color + '20' }]}>
                  <Ionicons name={ic.icon} size={16} color={ic.color} />
                </View>
                <View style={styles.notifItemBody}>
                  <Text style={styles.notifItemTitle}>{n.title}</Text>
                  <Text style={styles.notifItemMsg} numberOfLines={2}>{n.message}</Text>
                  <Text style={styles.notifItemTime}>{relTime(n.created_at)}</Text>
                </View>
                {!n.is_read && <View style={[styles.notifDot, { backgroundColor: ic.color }]} />}
              </TouchableOpacity>
            );
          })}
          <View style={{ height:24 }} />
        </ScrollView>
      </Animated.View>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
        }
      >

        {/* ── HEADER with greeting, name, school location, badges, avatar ── */}
        <LinearGradient colors={['#14102F','#0D0B24','#050714']} style={styles.hero}>
          <Animated.View style={[styles.heroTop, { opacity: fadeAnim }]}>
            {/* left: greeting + name + location (school) */}
            <View style={styles.heroLeft}>
              <Text style={styles.heroGreeting}>{greet()}</Text>
              <Text style={styles.heroName}>{firstName}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={14} color="#7C3AED" />
                <Text style={styles.locationText}>{school || 'School'}</Text>
              </View>
            </View>

            {/* right: badges + avatar */}
            <View style={styles.heroRight}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeNumber}>{stats.todaySessions || 0}</Text>
                  <Text style={styles.badgeLabel}>Active</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeNumber}>{stats.streak}</Text>
                  <Text style={styles.badgeLabel}>Streak</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeNumber}>{stats.subjects}</Text>
                  <Text style={styles.badgeLabel}>Subjects</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileTab')}
                activeOpacity={0.8}
                style={{ position:'relative' }}
              >
                {profileRow?.avatar_url ? (
                  <Image source={{ uri: profileRow.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <LinearGradient colors={['#7C3AED','#4C1D95']} style={styles.avatar}>
                    <Text style={styles.avatarInitial}>{initial}</Text>
                  </LinearGradient>
                )}
                <View style={styles.avatarOnline} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ── COUNTDOWN CARD (as shown in image) ── */}
          <Animated.View style={[styles.countdownCard, { transform:[{ scale: pulseAnim }] }]}>
            <View style={styles.countdownTop}>
              <Text style={styles.countdownTitle}>MATRIC EXAMS IN October 2026 Exams</Text>
              <Text style={styles.countdownSubtitle}>NSC · Full Time Candidates</Text>
            </View>
            <View style={styles.countdownUnits}>
              <View style={styles.countdownUnitLarge}>
                <Text style={styles.countdownNumberLarge}>{countdown.days}</Text>
                <Text style={styles.countdownLabel}>DAYS</Text>
              </View>
              <Text style={styles.countdownSeparator}>|</Text>
              <View style={styles.countdownUnit}>
                <Text style={styles.countdownNumber}>{String(countdown.hours).padStart(2,'0')}</Text>
                <Text style={styles.countdownLabel}>HRS</Text>
              </View>
              <Text style={styles.countdownSeparator}>|</Text>
              <View style={styles.countdownUnit}>
                <Text style={styles.countdownNumber}>{String(countdown.min).padStart(2,'0')}</Text>
                <Text style={styles.countdownLabel}>MIN</Text>
              </View>
              <Text style={styles.countdownSeparator}>|</Text>
              <View style={styles.countdownUnit}>
                <Text style={styles.countdownNumber}>{String(countdown.sec).padStart(2,'0')}</Text>
                <Text style={styles.countdownLabel}>SEC</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewPlanLink}
              onPress={() => navigation.navigate('StudyTab', { screen:'StudyPlanner' })}
            >
              <Text style={styles.viewPlanText}>View My Study Plan &gt;</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* ── ANNOUNCEMENTS (unchanged) ── */}
        {announcements.length > 0 && (
          <View style={styles.announcWrap}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => Alert.alert(
                announcements[announcIdx].title,
                announcements[announcIdx].message
              )}
            >
              <LinearGradient
                colors={['#1E1A4F','#15123A']}
                style={styles.announcCard}
                start={{x:0,y:0}} end={{x:1,y:1}}
              >
                <LinearGradient
                  colors={['#7C3AED','#4C1D95']}
                  style={styles.announcAccent}
                  start={{x:0,y:0}} end={{x:0,y:1}}
                />
                <View style={styles.announcBody}>
                  <View style={styles.announcTopRow}>
                    <View style={styles.announcBadge}>
                      <View style={styles.announcBadgePulse} />
                      <Text style={styles.announcBadgeText}>ANNOUNCEMENT</Text>
                    </View>
                    {announcements.length > 1 && (
                      <View style={styles.announcPager}>
                        {announcements.map((_, i) => (
                          <View
                            key={i}
                            style={[styles.announcPagerDot, i === announcIdx && styles.announcPagerDotActive]}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                  <Text style={styles.announcTitle} numberOfLines={1}>
                    {announcements[announcIdx].title}
                  </Text>
                  <Text style={styles.announcMsg} numberOfLines={2}>
                    {announcements[announcIdx].message}
                  </Text>
                </View>
                <View style={styles.announcArrow}>
                  <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* ── TODAY'S PROGRESS CARD (matches second image) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('StudyTab', { screen:'StudyAnalytics' })}
            >
              <Text style={styles.seeAll}>Analytics →</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={['#0D0B24','#0A0820']} style={styles.todayCard}>
            {/* Goal progress bar */}
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>25m / 2h 0m goal</Text>
              <Text style={styles.goalPercent}>20%</Text>
            </View>
            <View style={styles.goalBarTrack}>
              <Animated.View style={[styles.goalBarFill, { width:'20%' }]} />
            </View>

            {/* Stats row (four tiles) */}
            <View style={styles.todayStatsRow}>
              <StatTile icon="time-outline" value={fmtMins(stats.totalMins)} label="Studied" color="#7C3AED" />
              <StatTile icon="flame-outline" value={`${stats.streak}d`} label="Day Streak" color="#EF4444" />
              <StatTile icon="layers-outline" value={`${stats.subjects}`} label="Subjects" color="#F59E0B" />
              <StatTile icon="checkmark-circle-outline" value={`${stats.todaySessions}`} label="Completed" color="#10B981" />
            </View>
          </LinearGradient>
        </View>

        {/* ── QUICK ACTIONS (unchanged) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map(a => (
              <TouchableOpacity
                key={a.id}
                style={styles.actionTile}
                onPress={() => {
                  if (a.targetScreen) navigation.navigate(a.targetTab, { screen: a.targetScreen });
                  else navigation.navigate(a.targetTab);
                }}
                activeOpacity={0.82}
              >
                <LinearGradient colors={a.colors} style={styles.actionGrad}>
                  <View style={styles.actionIconBox}>
                    <Ionicons name={a.icon} size={22} color="#EDE9FE" />
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                  <Text style={styles.actionDesc}>{a.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── MY SUBJECTS SHORTCUT (unchanged) ── */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.navigate('MySubjects')} activeOpacity={0.82}>
            <LinearGradient colors={['#0D0B24','#0A0820']} style={styles.subjectShortcut}>
              <LinearGradient colors={['#7C3AED','#4C1D95']} style={styles.subjectShortcutIcon}>
                <Ionicons name="layers-outline" size={22} color="#EDE9FE" />
              </LinearGradient>
              <View style={styles.subjectShortcutBody}>
                <Text style={styles.subjectShortcutTitle}>My Subjects</Text>
                <Text style={styles.subjectShortcutSub}>
                  {stats.subjects > 0
                    ? `${stats.subjects} subject${stats.subjects !== 1 ? 's' : ''} · Tap to manage`
                    : 'Tap to add your subjects'}
                </Text>
              </View>
              <View style={styles.subjectShortcutArrow}>
                <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── UPCOMING EXAMS (unchanged) ── */}
        {exams.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Exams</Text>
              <TouchableOpacity onPress={() => navigation.navigate('StudyTab', { screen:'ExamTracker' })}>
                <Text style={styles.seeAll}>View all →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.examsCard}>
              {exams.map((ex, idx) => {
                const days   = Math.ceil((new Date(ex.exam_date) - new Date()) / 86400000);
                const color  = days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#7C3AED';
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.examRow, idx < exams.length - 1 && styles.examRowBorder]}
                    onPress={() => navigation.navigate('StudyTab', { screen:'ExamTracker' })}
                    activeOpacity={0.82}
                  >
                    <View style={[styles.examBar, { backgroundColor: color }]} />
                    <View style={styles.examBody}>
                      <Text style={styles.examSubject}>{ex.subject?.toUpperCase()}</Text>
                      <Text style={styles.examName} numberOfLines={1}>{ex.exam_name}</Text>
                      <Text style={styles.examDate}>
                        {new Date(ex.exam_date).toLocaleDateString('en-ZA',
                          { weekday:'short', day:'numeric', month:'short' })}
                        {ex.venue ? ` · ${ex.venue}` : ''}
                      </Text>
                    </View>
                    <View style={[styles.examCountPill, { backgroundColor: color + '18' }]}>
                      <Text style={[styles.examCountNum,   { color }]}>{days}</Text>
                      <Text style={[styles.examCountLabel, { color }]}>days</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── NEWS (unchanged) ── */}
        <View style={styles.newsSection}>
          <View style={[styles.sectionHeader, styles.newsSectionHeader]}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewsTab')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catRow}
          >
            {NEWS_CATEGORIES.map(c => {
              const active = newsCat === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catChip, active && styles.catChipActive]}
                  onPress={() => setNewsCat(c.id)}
                >
                  {active && (
                    <LinearGradient
                      colors={['#7C3AED','#5B21B6']}
                      style={StyleSheet.absoluteFillObject}
                      start={{x:0,y:0}} end={{x:1,y:0}}
                    />
                  )}
                  <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {newsLoading ? (
            <ActivityIndicator color="#7C3AED" style={{ marginVertical:30 }} />
          ) : news.length === 0 ? (
            <View style={styles.emptyNews}>
              <Ionicons name="newspaper-outline" size={36} color="#3D3A6B" />
              <Text style={styles.emptyNewsText}>No articles right now</Text>
            </View>
          ) : (
            <>
              <FlatList
                ref={newsRef}
                data={news}
                keyExtractor={n => n.id}
                horizontal pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 40}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal:20, gap:12 }}
                scrollEventThrottle={16}
                onScroll={e =>
                  setNewsIdx(Math.round(e.nativeEvent.contentOffset.x / (width - 40)))
                }
                onTouchStart={() => clearInterval(newsTimer.current)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.newsCard}
                    onPress={() => navigation.navigate('NewsDetail', { article: item })}
                    activeOpacity={0.88}
                  >
                    {item.imageUrl
                      ? <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
                      : (
                        <LinearGradient colors={['#0D0B24','#050714']} style={styles.newsImage}>
                          <Ionicons name="newspaper-outline" size={40} color="#3D3A6B" />
                        </LinearGradient>
                      )
                    }
                    <LinearGradient
                      colors={['transparent','rgba(5,7,20,0.55)','rgba(5,7,20,0.97)']}
                      style={styles.newsOverlay}
                    >
                      <View style={styles.newsMeta}>
                        <View style={[styles.newsSource, { backgroundColor:(item.color||'#7C3AED')+'30' }]}>
                          <Text style={[styles.newsSourceText, { color: item.color||'#A78BFA' }]}>
                            {item.source}
                          </Text>
                        </View>
                        <Text style={styles.newsAge}>{item.timeAgo}</Text>
                      </View>
                      <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                      <View style={styles.newsReadMore}>
                        <Text style={styles.newsReadMoreText}>Read more</Text>
                        <Ionicons name="arrow-forward" size={12} color="#A78BFA" />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.newsPager}>
                {news.map((_, i) => (
                  <View key={i} style={[styles.pagerDot, i === newsIdx && styles.pagerDotActive]} />
                ))}
              </View>
            </>
          )}
        </View>

        {/* ── QUOTE (unchanged) ── */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(124,58,237,0.10)','rgba(124,58,237,0.03)']}
            style={styles.quoteCard}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#7C3AED" />
            <Text style={styles.quoteText}>"{quote.q}"</Text>
            <View style={styles.quoteAuthorRow}>
              <View style={styles.quoteLine} />
              <Text style={styles.quoteAuthor}>{quote.a}</Text>
              <View style={styles.quoteLine} />
            </View>
          </LinearGradient>
        </View>

        <View style={{ height:56 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────── STYLES ──────────────────────────────────────
const S = StyleSheet;
const styles = S.create({
  root:    { flex:1, backgroundColor:'#050714' },
  loader:  { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#050714' },
  loaderIcon: { width:72, height:72, borderRadius:20, justifyContent:'center', alignItems:'center' },
  loaderText: { marginTop:14, fontSize:14, color:'#7874A8', fontWeight:'500' },

  // ── notification panel (pro styling, closable) ─────────────────────────
  notifBackdrop: { ...S.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.6)', zIndex:90 },
  notifPanel: {
    position:'absolute', top:0, left:0, right:0, zIndex:100,
    backgroundColor:'#0D0B24',
    borderBottomLeftRadius:28, borderBottomRightRadius:28,
    borderBottomWidth:1, borderColor:'#1A1836',
    paddingTop: Platform.OS==='ios' ? 54 : 42,
    paddingHorizontal:20, paddingBottom:16,
    shadowColor:'#000', shadowOffset:{width:0,height:10},
    shadowOpacity:0.55, shadowRadius:20, elevation:24,
  },
  notifHandle:   { width:36, height:4, backgroundColor:'#1A1836', borderRadius:2, alignSelf:'center', marginBottom:18 },
  notifHeader:   { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 },
  notifTitle:    { fontSize:20, fontWeight:'800', color:'#F0EDFF' },
  notifSubtitle: { fontSize:12, color:'#7C3AED', fontWeight:'600', marginTop:2 },
  notifHeaderRight:{ flexDirection:'row', alignItems:'center', gap:12 },
  markReadBtn:   { backgroundColor:'rgba(124,58,237,0.14)', paddingHorizontal:12, paddingVertical:5, borderRadius:10 },
  markReadText:  { fontSize:12, color:'#A78BFA', fontWeight:'700' },
  notifCloseBtn: { width:32, height:32, borderRadius:10, backgroundColor:'#12102A', justifyContent:'center', alignItems:'center' },
  notifEmpty:    { alignItems:'center', paddingVertical:40, gap:8 },
  notifEmptyTitle:{ fontSize:16, fontWeight:'700', color:'#4B4880', marginTop:4 },
  notifEmptyText: { fontSize:13, color:'#3D3A6B' },
  notifItem: {
    flexDirection:'row', alignItems:'flex-start',
    paddingVertical:12, gap:12,
    borderBottomWidth:1, borderBottomColor:'#0D0B24',
  },
  notifItemUnread:{ backgroundColor:'rgba(124,58,237,0.06)', borderRadius:14, paddingHorizontal:10 },
  notifItemIcon:  { width:36, height:36, borderRadius:10, justifyContent:'center', alignItems:'center' },
  notifItemBody:  { flex:1 },
  notifItemTitle: { fontSize:13, fontWeight:'700', color:'#E8E3FF', marginBottom:3 },
  notifItemMsg:   { fontSize:12, color:'#7874A8', lineHeight:17, marginBottom:4 },
  notifItemTime:  { fontSize:10, color:'#4B4880' },
  notifDot:       { width:8, height:8, borderRadius:4, marginTop:4 },

  // ── hero header ─────────────────────────────────────────────────────────
  hero: { paddingTop: Platform.OS==='ios' ? 58 : 46, paddingBottom:0, paddingHorizontal:20 },
  heroTop: { flexDirection:'row', justifyContent:'space-between', marginBottom:20 },
  heroLeft: { flex:1 },
  heroGreeting: { fontSize:13, color:'#7874A8', fontWeight:'500', marginBottom:2 },
  heroName: { fontSize:30, fontWeight:'900', color:'#F0EDFF', letterSpacing:-0.7, marginBottom:4 },
  locationRow: { flexDirection:'row', alignItems:'center', gap:5 },
  locationText: { fontSize:13, color:'#A78BFA', fontWeight:'600' },
  heroRight: { alignItems:'flex-end', gap:10 },
  badgeRow: { flexDirection:'row', gap:12, marginBottom:6 },
  badge: { alignItems:'center' },
  badgeNumber: { fontSize:16, fontWeight:'800', color:'#F0EDFF' },
  badgeLabel: { fontSize:10, color:'#7874A8', fontWeight:'600' },
  avatar: { width:48, height:48, borderRadius:24, justifyContent:'center', alignItems:'center' },
  avatarImage: { width:48, height:48, borderRadius:24, borderWidth:2, borderColor:'#7C3AED' },
  avatarInitial: { fontSize:18, fontWeight:'800', color:'#EDE9FE' },
  avatarOnline: {
    position:'absolute', bottom:1, right:1,
    width:12, height:12, borderRadius:6,
    backgroundColor:'#10B981', borderWidth:2.5, borderColor:'#050714',
  },

  // countdown card (as shown in image)
  countdownCard: {
    backgroundColor:'#0D0B24',
    borderRadius:22,
    padding:20,
    marginTop:8,
    marginBottom:6,
    borderWidth:1,
    borderColor:'#1A1836',
  },
  countdownTop: { marginBottom:12 },
  countdownTitle: { fontSize:14, fontWeight:'700', color:'#F0EDFF', letterSpacing:-0.2 },
  countdownSubtitle: { fontSize:11, color:'#7874A8', marginTop:2 },
  countdownUnits: { flexDirection:'row', alignItems:'center', justifyContent:'center', marginVertical:12 },
  countdownUnitLarge: { alignItems:'center', marginHorizontal:8 },
  countdownUnit: { alignItems:'center', marginHorizontal:4 },
  countdownNumberLarge: { fontSize:42, fontWeight:'900', color:'#F0EDFF' },
  countdownNumber: { fontSize:22, fontWeight:'800', color:'#F0EDFF' },
  countdownLabel: { fontSize:8, color:'#7874A8', fontWeight:'700', letterSpacing:0.5, marginTop:2 },
  countdownSeparator: { fontSize:20, color:'#3D3A6B', fontWeight:'700', marginBottom:8 },
  viewPlanLink: { marginTop:4, alignSelf:'flex-start' },
  viewPlanText: { fontSize:12, color:'#7C3AED', fontWeight:'700' },

  // announcements (unchanged)
  announcWrap: { marginHorizontal:20, marginTop:18 },
  announcCard: {
    flexDirection:'row', alignItems:'center',
    borderRadius:18, overflow:'hidden',
    borderWidth:1, borderColor:'rgba(124,58,237,0.22)',
  },
  announcAccent: { width:4, alignSelf:'stretch' },
  announcBody:   { flex:1, padding:14 },
  announcTopRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  announcBadge:  { flexDirection:'row', alignItems:'center', gap:6 },
  announcBadgePulse:{ width:6, height:6, borderRadius:3, backgroundColor:'#7C3AED' },
  announcBadgeText: { fontSize:9, fontWeight:'900', color:'#7C3AED', letterSpacing:1.5 },
  announcPager:  { flexDirection:'row', gap:4 },
  announcPagerDot:     { width:4, height:4, borderRadius:2, backgroundColor:'#3D3A6B' },
  announcPagerDotActive:{ width:10, backgroundColor:'#7C3AED', borderRadius:2 },
  announcTitle:  { fontSize:14, fontWeight:'700', color:'#E8E3FF', marginBottom:3 },
  announcMsg:    { fontSize:12, color:'#7874A8', lineHeight:17 },
  announcArrow:  { paddingHorizontal:14 },

  // section (unchanged)
  section: { paddingHorizontal:20, marginTop:24 },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  sectionTitle:  { fontSize:19, fontWeight:'800', color:'#F0EDFF', letterSpacing:-0.3 },
  seeAll:        { fontSize:13, color:'#7C3AED', fontWeight:'700' },

  // today's progress card (image style)
  todayCard: { borderRadius:20, padding:18, borderWidth:1, borderColor:'#1A1836' },
  goalHeader: { flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  goalLabel: { fontSize:14, color:'#E8E3FF', fontWeight:'600' },
  goalPercent: { fontSize:14, color:'#7874A8', fontWeight:'700' },
  goalBarTrack: { height:8, backgroundColor:'#12102A', borderRadius:4, marginBottom:20, overflow:'hidden' },
  goalBarFill: { height:'100%', backgroundColor:'#7C3AED', borderRadius:4 },
  todayStatsRow: { flexDirection:'row', justifyContent:'space-around', marginTop:8 },
  statTile: { alignItems:'center', gap:2 },
  statTileValue: { fontSize:16, fontWeight:'800', color:'#F0EDFF', marginTop:4 },
  statTileLabel: { fontSize:9, color:'#7874A8', fontWeight:'600' },

  // quick actions (unchanged)
  actionsGrid: { flexDirection:'row', flexWrap:'wrap', gap:10 },
  actionTile:  { width:(width - 50) / 2, height:126, borderRadius:18, overflow:'hidden' },
  actionGrad:  { flex:1, padding:14, justifyContent:'flex-end' },
  actionIconBox: { width:38, height:38, borderRadius:10, backgroundColor:'rgba(255,255,255,0.14)', justifyContent:'center', alignItems:'center', marginBottom:8 },
  actionLabel: { fontSize:13, fontWeight:'800', color:'#EDE9FE', marginBottom:2 },
  actionDesc:  { fontSize:10, color:'rgba(237,233,254,0.62)', lineHeight:13 },

  // subjects shortcut (unchanged)
  subjectShortcut: { flexDirection:'row', alignItems:'center', padding:18, borderRadius:18, borderWidth:1, borderColor:'#1A1836' },
  subjectShortcutIcon: { width:46, height:46, borderRadius:13, justifyContent:'center', alignItems:'center', marginRight:14 },
  subjectShortcutBody: { flex:1 },
  subjectShortcutTitle:{ fontSize:15, fontWeight:'700', color:'#F0EDFF' },
  subjectShortcutSub:  { fontSize:12, color:'#7874A8', marginTop:2 },
  subjectShortcutArrow:{ width:32, height:32, borderRadius:10, backgroundColor:'rgba(124,58,237,0.12)', justifyContent:'center', alignItems:'center' },

  // exams (unchanged)
  examsCard:    { backgroundColor:'#0D0B24', borderRadius:18, borderWidth:1, borderColor:'#1A1836', overflow:'hidden' },
  examRow:      { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:16 },
  examRowBorder:{ borderBottomWidth:1, borderBottomColor:'#12102A' },
  examBar:      { width:3, height:44, borderRadius:2, marginRight:14 },
  examBody:     { flex:1 },
  examSubject:  { fontSize:9, fontWeight:'900', color:'#7874A8', letterSpacing:1.2, marginBottom:4 },
  examName:     { fontSize:14, fontWeight:'700', color:'#E8E3FF', marginBottom:3 },
  examDate:     { fontSize:11, color:'#4B4880' },
  examCountPill: { alignItems:'center', paddingHorizontal:12, paddingVertical:8, borderRadius:12 },
  examCountNum:  { fontSize:22, fontWeight:'900' },
  examCountLabel:{ fontSize:8, fontWeight:'800', marginTop:1 },

  // news (unchanged)
  newsSection:       { marginTop:24 },
  newsSectionHeader: { paddingHorizontal:20 },
  catRow:    { paddingHorizontal:20, gap:8, marginBottom:14 },
  catChip:   { paddingHorizontal:14, paddingVertical:8, borderRadius:20, backgroundColor:'#0D0B24', borderWidth:1, borderColor:'#1A1836', overflow:'hidden' },
  catChipActive:     { borderColor:'#7C3AED' },
  catChipText:       { fontSize:12, color:'#4B4880', fontWeight:'600' },
  catChipTextActive: { color:'#EDE9FE' },
  newsCard:    { width:width - 64, height:230, borderRadius:22, overflow:'hidden' },
  newsImage:   { width:'100%', height:'100%', backgroundColor:'#0D0B24', justifyContent:'center', alignItems:'center' },
  newsOverlay: { position:'absolute', bottom:0, left:0, right:0, padding:18, paddingTop:60 },
  newsMeta:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  newsSource:  { paddingHorizontal:8, paddingVertical:3, borderRadius:7 },
  newsSourceText: { fontSize:10, fontWeight:'800', letterSpacing:0.3 },
  newsAge:     { fontSize:10, color:'#7874A8' },
  newsTitle:   { fontSize:16, fontWeight:'800', color:'#F0EDFF', lineHeight:22, letterSpacing:-0.2, marginBottom:8 },
  newsReadMore:{ flexDirection:'row', alignItems:'center', gap:4 },
  newsReadMoreText: { fontSize:12, color:'#A78BFA', fontWeight:'600' },
  newsPager:   { flexDirection:'row', justifyContent:'center', marginTop:14, gap:5 },
  pagerDot:    { width:5, height:5, borderRadius:2.5, backgroundColor:'#1A1836' },
  pagerDotActive: { width:16, backgroundColor:'#7C3AED', borderRadius:3 },
  emptyNews:   { alignItems:'center', paddingVertical:36, gap:10 },
  emptyNewsText:{ fontSize:13, color:'#3D3A6B' },

  // quote (unchanged)
  quoteCard: { padding:24, borderRadius:22, alignItems:'center', gap:14, borderWidth:1, borderColor:'rgba(124,58,237,0.15)' },
  quoteText: { fontSize:15, fontStyle:'italic', color:'#C4BFEA', textAlign:'center', lineHeight:24 },
  quoteAuthorRow: { flexDirection:'row', alignItems:'center', gap:12, width:'100%' },
  quoteLine:  { flex:1, height:1, backgroundColor:'rgba(124,58,237,0.18)' },
  quoteAuthor:{ fontSize:12, color:'#7C3AED', fontWeight:'700' },
});