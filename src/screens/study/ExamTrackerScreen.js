// screens/study/ExamTrackerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../services/supabaseConfig';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const SUBJECTS = [
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'Geography',
  'History',
  'Accounting',
  'Business Studies',
  'Economics',
  'English Home Language',
  'English First Additional',
  'Afrikaans',
  'IsiZulu',
  'Life Orientation',
];

export default function ExamTrackerScreen({ navigation }) {
  const { user } = useAuth();

  // State
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  // New exam form state
  const [newExam, setNewExam] = useState({
    subject: '',
    exam_name: '',
    exam_date: new Date(),
    notes: '',
  });

  // ================================================================
  // Data fetching
  // ================================================================
  useEffect(() => {
    fetchExams();
  }, [user]);

  useEffect(() => {
    filterExams();
  }, [exams, filter]);

  const fetchExams = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user.id)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      Alert.alert('Error', 'Failed to load exams');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchExams();
  };

  const filterExams = () => {
    const now = new Date();
    let filtered = [...exams];

    switch (filter) {
      case 'upcoming':
        filtered = filtered.filter((exam) => new Date(exam.exam_date) >= now);
        break;
      case 'past':
        filtered = filtered.filter((exam) => new Date(exam.exam_date) < now);
        break;
      default:
        // 'all' – keep all
        break;
    }

    setFilteredExams(filtered);
  };

  // ================================================================
  // CRUD operations
  // ================================================================
  const handleAddExam = async () => {
    if (!newExam.subject.trim() || !newExam.exam_name.trim()) {
      Alert.alert('Missing Information', 'Please fill in subject and exam name');
      return;
    }

    try {
      setLoading(true);
      const examData = {
        user_id: user.id,
        subject: newExam.subject,
        exam_name: newExam.exam_name,
        exam_date: newExam.exam_date.toISOString(),
        notes: newExam.notes || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('exams')
        .insert([examData])
        .select()
        .single();

      if (error) throw error;

      setExams([...exams, data]);
      setShowAddModal(false);
      resetNewExam();
      Alert.alert('Success', 'Exam added successfully');
    } catch (error) {
      console.error('Error adding exam:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExam = async () => {
    if (!editingExam) return;

    try {
      setLoading(true);
      const updatedData = {
        subject: newExam.subject,
        exam_name: newExam.exam_name,
        exam_date: newExam.exam_date.toISOString(),
        notes: newExam.notes || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('exams')
        .update(updatedData)
        .eq('id', editingExam.id);

      if (error) throw error;

      // Update local state
      setExams(
        exams.map((exam) =>
          exam.id === editingExam.id ? { ...exam, ...updatedData } : exam
        )
      );
      setShowAddModal(false);
      setEditingExam(null);
      resetNewExam();
      Alert.alert('Success', 'Exam updated successfully');
    } catch (error) {
      console.error('Error updating exam:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = (examId) => {
    Alert.alert(
      'Delete Exam',
      'Are you sure you want to delete this exam?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('exams')
                .delete()
                .eq('id', examId);

              if (error) throw error;

              setExams(exams.filter((e) => e.id !== examId));
              Alert.alert('Success', 'Exam deleted');
            } catch (error) {
              console.error('Error deleting exam:', error);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setNewExam({
      subject: exam.subject,
      exam_name: exam.exam_name,
      exam_date: new Date(exam.exam_date),
      notes: exam.notes || '',
    });
    setShowAddModal(true);
  };

  const resetNewExam = () => {
    setNewExam({
      subject: '',
      exam_name: '',
      exam_date: new Date(),
      notes: '',
    });
    setEditingExam(null);
  };

  // ================================================================
  // Helper functions
  // ================================================================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysLeft = (dateString) => {
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (dateString) => {
    const daysLeft = getDaysLeft(dateString);
    if (daysLeft < 0) return '#636E72'; // past
    if (daysLeft <= 7) return '#FF7675'; // urgent (<= 7 days)
    if (daysLeft <= 30) return '#FDCB6E'; // soon (<= 30 days)
    return '#00B894'; // far away
  };

  // ================================================================
  // Render
  // ================================================================
  const renderExamItem = ({ item }) => {
    const daysLeft = getDaysLeft(item.exam_date);
    const statusColor = getStatusColor(item.exam_date);
    const isPast = daysLeft < 0;

    return (
      <TouchableOpacity
        style={styles.examCard}
        onPress={() => openEditModal(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isPast ? ['#1E2340', '#2D3561'] : ['#1E2340', '#2D3561']}
          style={styles.examGradient}
        >
          <View style={styles.examHeader}>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectText}>{item.subject}</Text>
            </View>
            <View style={[styles.daysBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.daysText, { color: statusColor }]}>
                {isPast ? 'Past' : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
              </Text>
            </View>
          </View>

          <Text style={styles.examName}>{item.exam_name}</Text>

          <View style={styles.examDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#A29BFE" />
              <Text style={styles.detailText}>{formatDate(item.exam_date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#A29BFE" />
              <Text style={styles.detailText}>{formatTime(item.exam_date)}</Text>
            </View>
            {item.notes ? (
              <View style={styles.detailRow}>
                <Ionicons name="document-text-outline" size={16} color="#A29BFE" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.notes}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.examFooter}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteExam(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#FF7675" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditModal(item)}
            >
              <Ionicons name="create-outline" size={18} color="#6C5CE7" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Loading exams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1E2340', '#6C5CE7']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Exam Tracker</Text>
            <Text style={styles.headerSubtitle}>Keep track of your exams</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetNewExam();
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Stats overview */}
        <View style={styles.statsOverview}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{exams.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#00B894' }]}>
              {exams.filter((e) => getDaysLeft(e.exam_date) > 0).length}
            </Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#636E72' }]}>
              {exams.filter((e) => getDaysLeft(e.exam_date) <= 0).length}
            </Text>
            <Text style={styles.statLabel}>Past</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        {['upcoming', 'all', 'past'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterTab, filter === type && styles.filterTabActive]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exams list */}
      <FlatList
        data={filteredExams}
        renderItem={renderExamItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C5CE7"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#636E72" />
            <Text style={styles.emptyTitle}>No exams found</Text>
            <Text style={styles.emptyText}>
              {filter === 'upcoming'
                ? 'No upcoming exams. Add one to get started.'
                : filter === 'past'
                ? 'No past exams.'
                : 'Tap + to add your first exam.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                resetNewExam();
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.emptyButtonText}>Add Exam</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          resetNewExam();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1E2340', '#0A0E27']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingExam ? 'Edit Exam' : 'Add New Exam'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    resetNewExam();
                  }}
                >
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Subject */}
                <Text style={styles.formLabel}>Subject *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.subjectButtons}>
                    {SUBJECTS.map((subject) => (
                      <TouchableOpacity
                        key={subject}
                        style={[
                          styles.subjectButton,
                          newExam.subject === subject && styles.subjectButtonActive,
                        ]}
                        onPress={() => setNewExam({ ...newExam, subject })}
                      >
                        <Text
                          style={[
                            styles.subjectButtonText,
                            newExam.subject === subject && styles.subjectButtonTextActive,
                          ]}
                        >
                          {subject}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Exam Name */}
                <Text style={styles.formLabel}>Exam Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Mathematics Paper 1"
                  placeholderTextColor="#636E72"
                  value={newExam.exam_name}
                  onChangeText={(text) => setNewExam({ ...newExam, exam_name: text })}
                />

                {/* Date and Time */}
                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Text style={styles.formLabel}>Date</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {newExam.exam_date.toDateString()}
                      </Text>
                      <Ionicons name="calendar" size={20} color="#6C5CE7" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.formLabel}>Time</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {newExam.exam_date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <Ionicons name="time" size={20} color="#6C5CE7" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Notes */}
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any additional details..."
                  placeholderTextColor="#636E72"
                  value={newExam.notes}
                  onChangeText={(text) => setNewExam({ ...newExam, notes: text })}
                  multiline
                  numberOfLines={3}
                />

                {/* Action Button */}
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (!newExam.subject || !newExam.exam_name) && styles.saveButtonDisabled,
                  ]}
                  onPress={editingExam ? handleUpdateExam : handleAddExam}
                  disabled={!newExam.subject || !newExam.exam_name}
                >
                  <Text style={styles.saveButtonText}>
                    {editingExam ? 'Update Exam' : 'Add Exam'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* DatePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={newExam.exam_date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              // Preserve time part
              const currentTime = new Date(newExam.exam_date);
              selectedDate.setHours(
                currentTime.getHours(),
                currentTime.getMinutes(),
                currentTime.getSeconds()
              );
              setNewExam({ ...newExam, exam_date: selectedDate });
            }
          }}
        />
      )}

      {/* TimePicker */}
      {showTimePicker && (
        <DateTimePicker
          value={newExam.exam_date}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              // Preserve date part
              const currentDate = new Date(newExam.exam_date);
              selectedTime.setFullYear(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
              );
              setNewExam({ ...newExam, exam_date: selectedTime });
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#A29BFE',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A29BFE',
  },
  addButton: {
    padding: 8,
  },
  statsOverview: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A29BFE',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E2340',
    borderWidth: 1,
    borderColor: '#2D3561',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A29BFE',
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  examCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  examGradient: {
    padding: 20,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectBadge: {
    backgroundColor: '#6C5CE720',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  daysBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysText: {
    fontSize: 13,
    fontWeight: '700',
  },
  examName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  examDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#A29BFE',
    flex: 1,
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  deleteButton: {
    padding: 6,
  },
  editButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  modalGradient: {
    paddingTop: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3561',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  modalBody: {
    padding: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A29BFE',
    marginBottom: 8,
    marginTop: 16,
  },
  subjectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1E2340',
    borderWidth: 1,
    borderColor: '#2D3561',
  },
  subjectButtonActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  subjectButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A29BFE',
  },
  subjectButtonTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#1E2340',
    borderWidth: 1,
    borderColor: '#2D3561',
    borderRadius: 12,
    padding: 14,
    color: '#FFF',
    fontSize: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: '#1E2340',
    borderWidth: 1,
    borderColor: '#2D3561',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});