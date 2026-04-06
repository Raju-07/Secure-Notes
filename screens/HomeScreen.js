import React, { useContext, useRef, useState, useEffect } from "react";
import { 
  StyleSheet, View, Text, ScrollView, Modal, Animated, 
  Easing, TouchableWithoutFeedback, Pressable, Platform, TextInput 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { SecureStorage } from "../services/SecureStorage"; // Ensure this service exists

export default function HomeScreen() {
  // --- STATES ---
  const { colors, activeTheme } = useContext(ThemeContext);
  const [isModalVisible, setIsModalVisible] = useState(false); // Option Picker
  const [isInputModalVisible, setIsInputModalVisible] = useState(false); // Note Editor
  const [notes, setNotes] = useState([]); // List of secure notes
  const [isGridView, setIsGridView] = useState(false); // Layout toggle
  const [isNewestFirst, setIsNewestFirst] = useState(true); // Sorting toggle
  
  // Temporary state for the note currently being written
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const slideAni = useRef(new Animated.Value(0)).current;

  // --- OPTIONS ---
  const options = [
    { id: '1', name: "Password", icon: 'lock-closed-outline' },
    { id: '2', name: 'Notes', icon: 'document-text-outline' },
    { id: '3', name: 'Events', icon: 'calendar-outline' },
    { id: '4', name: 'PassKey', icon: 'key-outline' },
    { id: '5', name: 'Remind', icon: 'alarm-outline' },
  ];

  // --- DATA OPERATIONS ---
  
  // Load notes from Secure Vault on startup
  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await SecureStorage.getNotes();
      setNotes(savedNotes);
    };
    fetchNotes();
  }, []);

  // Save the note to hardware-encrypted storage
  const handleSaveNote = async () => {
    if (!noteTitle.trim()) return; // Validation: Don't save empty titles

    const newEntry = {
      id: Date.now().toString(), // Unique ID for each note
      title: noteTitle,
      content: noteContent,
      date: Date.now(), // Timestamp for sorting logic
    };

    const updatedNotes = [newEntry, ...notes];
    await SecureStorage.saveNotes(updatedNotes);
    setNotes(updatedNotes); // Update UI state instantly
    
    // Clear inputs and close modal
    setNoteTitle('');
    setNoteContent('');
    setIsInputModalVisible(false);
  };

  // --- ANIMATIONS ---
  const openModal = () => {
    setIsModalVisible(true);
    Animated.spring(slideAni, { 
      toValue: 1, 
      friction: 8, 
      tension: 40, 
      useNativeDriver: true 
    }).start();
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const closeModal = () => {
    Animated.timing(slideAni, { 
      toValue: 0, 
      duration: 250, 
      easing: Easing.in(Easing.ease), 
      useNativeDriver: true 
    }).start(() => setIsModalVisible(false));
  };

  const translateY = slideAni.interpolate({ 
    inputRange: [0, 1], 
    outputRange: [300, 0] 
  });

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* HEADER SECTION */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { color: colors.text }]}>Secure Notes</Text>
          <View style={styles.actionIcons}>
            {/* Sorting Toggle */}
            <Pressable onPress={() => setIsNewestFirst(!isNewestFirst)} style={styles.iconButton}>
              <Ionicons 
                name={isNewestFirst ? "arrow-down" : "arrow-up"} 
                size={22} 
                color={colors.primary}
              />
            </Pressable>
            {/* Layout Toggle */}
            <Pressable onPress={() => setIsGridView(!isGridView)} style={styles.iconButton}>
              <Ionicons 
                name={isGridView ? "list" : "grid"} 
                size={22} 
                color={colors.primary} 
              />
            </Pressable>
          </View>
        </View>

        {/* SCROLLABLE CONTENT AREA */}
        <ScrollView 
          contentContainerStyle={isGridView ? styles.gridBody : styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          {notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark-outline" size={80} color={colors.text + '20'} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Your vault is empty.{"\n"}Tap the + button to add a secure note.
              </Text>
            </View>
          ) : (
            notes
              .sort((a, b) => isNewestFirst ? b.date - a.date : a.date - b.date)
              .map((item) => (
                <View 
                  key={item.id} 
                  style={[
                    isGridView ? styles.gridCard : styles.card, 
                    { backgroundColor: colors.card, borderColor: colors.borderColor }
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="document-text" size={24} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
          )}
        </ScrollView>
      </SafeAreaView>

      {/* FAB - ADD BUTTON */}
      <Pressable style={[styles.fab, { backgroundColor: colors.primary }]} onPress={openModal}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      {/* OPTIONS PICKER MODAL */}
      <Modal visible={isModalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={closeModal}><View style={styles.backdropTouchable} /></TouchableWithoutFeedback>
          <Animated.View style={[
            styles.bottomSheet, 
            { transform: [{ translateY }] }, 
            Platform.OS === 'android' && { backgroundColor: colors.card }
          ]}>
            {Platform.OS === 'ios' && <BlurView intensity={80} tint={activeTheme} style={StyleSheet.absoluteFill} />}
            <View style={styles.grid}>
              {options.map(o => (
                <Pressable 
                  key={o.id} 
                  android_ripple={{ color: colors.primary + '33' }} 
                  style={({ pressed }) => [styles.cell, { opacity: pressed ? 0.5 : 1 }]} 
                  onPress={() => {
                    closeModal();
                    if (o.name === 'Notes') setIsInputModalVisible(true);
                  }}
                >
                  <Ionicons name={o.icon} size={32} color={colors.primary} />
                  <Text style={[styles.label, { color: colors.text }]}>{o.name}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* NEW NOTE INPUT MODAL */}
      <Modal visible={isInputModalVisible} animationType="slide">
        <View style={[styles.inputModalMain, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.inputHeader}>
              <Pressable onPress={() => setIsInputModalVisible(false)}>
                <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '600' }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveNote}>
                <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '600' }}>Save</Text>
              </Pressable>
            </View>

            <TextInput 
              placeholder="Note Title"
              placeholderTextColor={colors.textMuted}
              style={[styles.titleInput, { color: colors.text }]}
              value={noteTitle}
              onChangeText={setNoteTitle}
              autoFocus={true}
            />
            <TextInput 
              placeholder="Type your secure note here..."
              placeholderTextColor={colors.textMuted}
              style={[styles.contentInput, { color: colors.text }]}
              multiline={true}
              value={noteContent}
              onChangeText={setNoteContent}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingRight: 20,
    marginTop: 10
  },
  actionIcons: { flexDirection: 'row' },
  iconButton: { marginLeft: 15, padding: 5 },
  headerText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginHorizontal: 20, 
    marginBottom: 20 
  },
  
  // Layout Body Styles
  scrollBody: { paddingHorizontal: 20, paddingBottom: 100 },
  gridBody: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 15, 
    justifyContent: 'space-between',
    paddingBottom: 100
  },

  // List Card
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  // Grid Card
  gridCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },

  iconBox: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  
  // Empty State
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, lineHeight: 24 },

  fab: { 
    position: 'absolute', 
    right: 25, 
    bottom: 30, 
    width: 65, 
    height: 65, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  backdropTouchable: { flex: 1 },
  bottomSheet: { 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    minHeight: 250, 
    overflow: 'hidden' 
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.33%', alignItems: 'center', padding: 15 },
  label: { marginTop: 8, fontSize: 12, fontWeight: '600' },

  // Input Modal Styles
  inputModalMain: { flex: 1, padding: 20 },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  titleInput: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  contentInput: { fontSize: 18, flex: 1, textAlignVertical: 'top' }
});