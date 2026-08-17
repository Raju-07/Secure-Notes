import React, { useContext, useRef, useState, useEffect } from "react";
import {
  StyleSheet, View, Text, ScrollView, Modal, Animated,
  Easing, TouchableWithoutFeedback, Pressable, Platform,
  TextInput, Switch, KeyboardAvoidingView,PanResponder,
  AppState
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-date-picker";
import * as LocalAuthentication from "expo-local-authentication"
//password Generator
import PasswordGeneratorModal from "../components/PasswordGeneratorModal";
import CustomAlert from '../components/CustomAlert';

// label tags
const KEYS = {
  NOTES: "@vault_notes",
  PASSWORDS: "@vault_passwords",
  EVENTS: "@vault_events",
  PASSKEYS: "@vault_passkeys",
  REMINDERS: "@vault_reminders",
  DRAFT : "@vault_draft",
};

//Getting and saving data
const SecureStorage = {
  getNotes: async () => { try { return JSON.parse(await AsyncStorage.getItem(KEYS.NOTES)) || []; } catch { return []; } },
  saveNotes: async (data) => { try { await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(data)); } catch {} },
  getPasswords: async () => { try { return JSON.parse(await AsyncStorage.getItem(KEYS.PASSWORDS)) || []; } catch { return []; } },
  savePasswords: async (data) => { try { await AsyncStorage.setItem(KEYS.PASSWORDS, JSON.stringify(data)); } catch {} },
  getEvents: async () => { try { return JSON.parse(await AsyncStorage.getItem(KEYS.EVENTS)) || []; } catch { return []; } },
  saveEvents: async (data) => { try { await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(data)); } catch {} },
  getPassKeys: async () => { try { return JSON.parse(await AsyncStorage.getItem(KEYS.PASSKEYS)) || []; } catch { return []; } },
  savePassKeys: async (data) => { try { await AsyncStorage.setItem(KEYS.PASSKEYS, JSON.stringify(data)); } catch {} },
  getReminders: async () => { try { return JSON.parse(await AsyncStorage.getItem(KEYS.REMINDERS)) || []; } catch { return []; } },
  saveReminders: async (data) => { try { await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(data)); } catch {} },
  savedDraft: async (data) => {try {await AsyncStorage.setItem(KEYS.DRAFT,JSON.stringify(data));}catch {}},
  getDraft: async () => {try { return JSON.parse(await AsyncStorage.getItem(KEYS.DRAFT));} catch{}},
  clearDraft: async() => {try {await AsyncStorage.removeItem(KEYS.DRAFT);} catch {}},
};

//  HELPERS
const haptic = () => { if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); };
const formatDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const formatDateTime = (ts) => new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
// psw generator helper function
const handleSaveGeneratedPassword = async (newPasswordItem) => {
  const updatedList = [newPasswordItem, ...passwords];
  await SecureStorage.savePasswords(updatedList);
  setPasswords(updatedList);
};

// Top Bar different options and themes color
const SECTIONS = [
  { id: 'all',       label: 'All',      icon: 'grid-outline',           filledIcon: 'grid',               color: '#6366F1' },
  { id: 'notes',     label: 'Notes',    icon: 'document-text-outline',  filledIcon: 'document-text',      color: '#63a7ff' },
  { id: 'passwords', label: 'Password', icon: 'lock-closed-outline',    filledIcon: 'lock-closed',        color: '#FF6584' },
  { id: 'events',    label: 'Events',   icon: 'calendar-outline',       filledIcon: 'calendar',           color: '#43C6AC' },
  { id: 'passkeys',  label: 'PassKey',  icon: 'key-outline',            filledIcon: 'key',                color: '#F7971E' },
  { id: 'reminders', label: 'Remind',   icon: 'alarm-outline',          filledIcon: 'alarm',              color: '#E040FB' },
];


const Field = ({ label, value, key_, placeholder, multiline, secureEntry, keyboardType, viewMode, showPassword, onTogglePassword, colors, form, setForm }) => (
  <View style={styles.fieldWrap}>
    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{label}</Text>
    {viewMode ? (
      <View style={[styles.fieldView, { backgroundColor: colors.card }]}>
        <Text style={[styles.fieldViewText, { color: colors.text }]} selectable>
          {secureEntry && !showPassword ? '••••••••••' : (value || '—')}
        </Text>
        {secureEntry && (
          <Pressable onPress={onTogglePassword} hitSlop={10} style={{ padding: 4 }}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    ) : (
      <View style={[
          styles.inputRow, 
          { backgroundColor: colors.card, borderWidth: 1, borderColor: form[key_] ? colors.primary + '40' : 'transparent' }
      ]}>
        <TextInput
          style={[styles.input, { 
              color: colors.text, 
              flex: 1, 
              minHeight: multiline ? 100 : 'auto', 
              textAlignVertical: multiline ? 'top' : 'center' 
          }]}
          value={form[key_] ?? ''}
          onChangeText={v => setForm(f => ({ ...f, [key_]: v }))}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          secureTextEntry={secureEntry && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
        />
        {secureEntry && (
          <Pressable onPress={onTogglePassword} hitSlop={10} style={{ padding: 4 }}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    )}
  </View>
);

//  MAIN COMPONENT
export default function HomeScreen() {
  const { colors, activeTheme } = useContext(ThemeContext);

  const [activeSection, setActiveSection]   = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGridView, setIsGridView]         = useState(false);
  const [isNewestFirst, setIsNewestFirst]   = useState(true);

  const [notes,     setNotes]     = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [events,    setEvents]    = useState([]);
  const [passkeys,  setPasskeys]  = useState([]);
  const [reminders, setReminders] = useState([]);

  const [detailItem,       setDetailItem]       = useState(null);
  const [isDetailVisible,  setIsDetailVisible]  = useState(false);
  const [isEditing,        setIsEditing]        = useState(false);
  const [form,             setForm]             = useState({});
  const [showPassword,     setShowPassword]     = useState(false);

  // Date Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const slideAni = useRef(new Animated.Value(0)).current;

  // Add this inside the HomeScreen component
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        // If dragged down by more than 50 pixels, close the modal
        if (gestureState.dy > 50) {
          setIsDetailVisible(false);
        }
      }
    })
  ).current;

  // DRAFT CACHE System
  const draftRef = useRef(null);

  // keeping the ref updated with the latest form data to avoid stale closures in the AppState Listener
  useEffect(()=> {
    if (isDetailVisible && Object.keys(form).length > 0){
      draftRef.current = {
        form,
        type: detailItem ? detailItem.type : activeSection,
        isEditing,
        detailItem
      };
    } else {
      draftRef.current = null;
    }
  },[form,isDetailVisible,activeSection,detailItem,isEditing]);

  useEffect(()=>{
    (async () => {
      setNotes(await SecureStorage.getNotes());
      setPasswords(await SecureStorage.getPasswords());
      setEvents(await SecureStorage.getEvents());
      setPasskeys(await SecureStorage.getPassKeys());
      setReminders(await SecureStorage.getReminders());

      //check for a saved draft
      const savedDraft = await SecureStorage.getDraft();
      // Restoring the draft item on relaunch
      if (savedDraft) {
        showCustomAlert(
          'Unsaved Draft Found',
          'You have an unsaved item from your last session. Would you like to restore it ?',
          'info',
          true,
        ()=> {
          // on confirm: Restoring the data and opening the modal
          setActiveSection(savedDraft.type);
          setDetailItem(savedDraft.detailItem);
          setForm(savedDraft.form);
          setIsEditing(savedDraft.isEditing);
          setIsDetailVisible(true);
          SecureStorage.clearDraft();
        },
        'Restore'
        );
      }
    })();
  },[]);

  // for listening the appstate change
  useEffect(()=>{
    const handleAppStateChange = async (nextAppState) => {
      // if app goes to bg or becomes inactive i.e. setFailedAttempts
      if (nextAppState === 'background' || nextAppState === 'inactive'){
        if (draftRef.current){
          await SecureStorage.savedDraft(draftRef.current);
        }
      }
    };
    const subscription = AppState.addEventListener('change',handleAppStateChange);
    return ()=> subscription.remove();
  },[]);



  const openFab = () => {
    setIsModalVisible(true);
    haptic();
    Animated.spring(slideAni, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
  };

  const closeFab = (cb) => {
    Animated.timing(slideAni, { toValue: 0, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() => { setIsModalVisible(false); cb?.(); });
  };

  const translateY = slideAni.interpolate({ inputRange: [0, 1], outputRange: [350, 0] });

  const openCreateForm = (sectionId) => {
    setIsEditing(false);
    setDetailItem(null);
    setForm({});
    setShowPassword(false);
    closeFab(() => {
      const target = sectionId === 'all' ? 'notes' : sectionId;
      setActiveSection(target);
      setTimeout(() => setIsDetailVisible(true), 100);
    });
  };

  const openDetail = (item) => {
    haptic();
    setDetailItem(item);
    setForm({ ...item });
    setIsEditing(false);
    setShowPassword(false);
    setIsDetailVisible(true);
  };

  const handleSave = async () => {
    const ts = Date.now();
    const sectionToSave = detailItem ? detailItem.type : activeSection;
    
    switch (sectionToSave) {
      case 'notes': {
        if (!form.title?.trim()) return showCustomAlert('Title Required', 'Please enter a title to secure this note.', 'warning');
        const entry = { id: detailItem?.id || ts.toString(), type: 'notes', title: form.title, content: form.content || '', date: detailItem?.date || ts };
        const list = detailItem ? notes.map(n => n.id === entry.id ? entry : n) : [entry, ...notes];
        await SecureStorage.saveNotes(list); setNotes(list); break;
      }
      case 'passwords': {
        if (!form.title?.trim()) return showCustomAlert('App Name Required', 'Please provide a Site or App name.', 'warning');
        const entry = { id: detailItem?.id || ts.toString(), type: 'passwords', title: form.title, username: form.username || '', password: form.password || '', url: form.url || '', date: detailItem?.date || ts };
        const list = detailItem ? passwords.map(p => p.id === entry.id ? entry : p) : [entry, ...passwords];
        await SecureStorage.savePasswords(list); setPasswords(list); break;
      }
      case 'events': {
        if (!form.title?.trim()) return showCustomAlert('Event Title Required', 'Please provide a title for this event.', 'warning');
        const entry = { id: detailItem?.id || ts.toString(), type: 'events', title: form.title, location: form.location || '', description: form.description || '', eventDate: form.eventDate || new Date().toISOString(), date: detailItem?.date || ts };
        const list = detailItem ? events.map(e => e.id === entry.id ? entry : e) : [entry, ...events];
        await SecureStorage.saveEvents(list); setEvents(list); break;
      }
      case 'passkeys': {
        if (!form.title?.trim() || !form.secret?.trim()) return showCustomAlert('Missing Info', 'Both Name and Secret Key are required.', 'warning');
        const entry = { id: detailItem?.id || ts.toString(), type: 'passkeys', title: form.title, account: form.account || '', secret: form.secret, date: detailItem?.date || ts };
        const list = detailItem ? passkeys.map(p => p.id === entry.id ? entry : p) : [entry, ...passkeys];
        await SecureStorage.savePassKeys(list); setPasskeys(list); break;
      }
      case 'reminders': {
        if (!form.title?.trim()) return showCustomAlert('Reminder Required', 'Please provide a title for this reminder.', 'warning');
        const entry = { id: detailItem?.id || ts.toString(), type: 'reminders', title: form.title, note: form.note || '', remindAt: form.remindAt || new Date().toISOString(), done: form.done || false, date: detailItem?.date || ts };
        const list = detailItem ? reminders.map(r => r.id === entry.id ? entry : r) : [entry, ...reminders];
        await SecureStorage.saveReminders(list); setReminders(list); break;
      }
    }
    setIsDetailVisible(false);
  };

  const handleDelete = () => {
  // Close the detail modal first to avoid modal stacking issues on iOS
  setIsDetailVisible(false);
  
  // Show the custom alert after a small delay to ensure the detail modal is closed
  setTimeout(() => {
    showCustomAlert(
      'Delete Item?', 
      'Are you sure you want to permanently delete this item? This action cannot be undone.', 
      'danger', 
      true, 
      async () => {
        const id = detailItem.id;
        const sectionToDelete = detailItem.type;
        switch (sectionToDelete) {
          case 'notes': { const l = notes.filter(x => x.id !== id); await SecureStorage.saveNotes(l); setNotes(l); break; }
          case 'passwords': { const l = passwords.filter(x => x.id !== id); await SecureStorage.savePasswords(l); setPasswords(l); break; }
          case 'events': { const l = events.filter(x => x.id !== id); await SecureStorage.saveEvents(l); setEvents(l); break; }
          case 'passkeys': { const l = passkeys.filter(x => x.id !== id); await SecureStorage.savePassKeys(l); setPasskeys(l); break; }
          case 'reminders': { const l = reminders.filter(x => x.id !== id); await SecureStorage.saveReminders(l); setReminders(l); break; }
        }
        setDetailItem(null);
      },
      'Delete'
    );
  }, 300);
};

  const toggleReminderStatus = async (item, newValue) => {
    const updated = { ...item, done: newValue };
    const list = reminders.map(r => r.id === item.id ? updated : r);
    await SecureStorage.saveReminders(list); 
    setReminders(list);
    setDetailItem(updated);
  };

  // --- CUSTOM ALERT STATE ---
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false,
    confirmText: 'OK',
  });

  const showCustomAlert = (title, message, type = 'info', showCancel = false, onConfirm = null, confirmText = 'OK') => {
    setAlertState({ 
      visible: true, 
      title, 
      message, 
      type, 
      showCancel, 
      onConfirm, 
      confirmText 
    });
  };

  const hideAlert = () => setAlertState(prev => ({ ...prev, visible: false }));
  
  const currentData = (() => {
    const combined = [
      ...notes.map(i => ({ ...i, type: 'notes' })),
      ...passwords.map(i => ({ ...i, type: 'passwords' })),
      ...events.map(i => ({ ...i, type: 'events' })),
      ...passkeys.map(i => ({ ...i, type: 'passkeys' })),
      ...reminders.map(i => ({ ...i, type: 'reminders' })),
    ];
    if (activeSection === 'all') return combined.sort((a, b) => isNewestFirst ? b.date - a.date : a.date - b.date);
    return combined.filter(i => i.type === activeSection).sort((a, b) => isNewestFirst ? b.date - a.date : a.date - b.date);
  })();

  // 1. UPDATED CARD RENDERER
  const renderCard = (item) => {
    const type = item.type;
    const cfg = SECTIONS.find(s => s.id === type) || SECTIONS[1];
    
    const subtitle = (() => {
      if (type === 'passwords') return item.username || 'No username';
      if (type === 'events')    return formatDateTime(new Date(item.eventDate || item.date).getTime());
      if (type === 'passkeys')  return item.account || 'No account';
      if (type === 'reminders') return formatDateTime(new Date(item.remindAt || item.date).getTime());
      return formatDate(item.date);
    })();

    return (
      <Pressable
        key={item.id}
        onPress={() => openDetail(item)}
        activeOpacity={0.7}
        style={[
          isGridView ? styles.gridCard : styles.card,
          { backgroundColor: colors.card }
        ]}
      >
        <View style={[
            styles.iconBox, 
            { backgroundColor: cfg.color + '15', marginBottom: isGridView ? 12 : 0, marginRight: isGridView ? 0 : 16 }
        ]}>
          <Ionicons name={cfg.filledIcon} size={22} color={cfg.color} />
        </View>
        
        {/* UPDATED TEXT WRAPPER */}
        <View style={{ flex: 1, width: '100%', alignItems: isGridView ? 'center' : 'stretch' }}>
          
          <View style={[styles.cardHeaderRow, isGridView && { justifyContent: 'center' }]}>
            <Text 
                style={[
                    styles.cardTitle, 
                    { color: colors.text },
                    isGridView && { textAlign: 'center', marginRight: 0 }
                ]} 
                numberOfLines={1}
            >
                {item.title}
            </Text>
            
            {activeSection === 'all' && !isGridView && (
              <View style={[styles.typeBadge, { backgroundColor: colors.background }]}>
                <Text style={{ fontSize: 9, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5 }}>
                    {cfg.label.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginTop: 4, 
              justifyContent: isGridView ? 'center' : 'flex-start',
              width: '100%' 
          }}>
            <Text 
                style={{ 
                    color: colors.textMuted, 
                    fontSize: 13, 
                    flexShrink: 1,
                    textAlign: isGridView ? 'center' : 'left' 
                }} 
                numberOfLines={1}
            >
                {subtitle}
            </Text>
          </View>

          {type === 'reminders' && (
            <View style={[
                styles.doneBadge, 
                { backgroundColor: item.done ? '#43C6AC15' : '#E040FB15' },
                isGridView && { alignSelf: 'center', marginTop: 10 } // Centers the badge in grid view
            ]}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: item.done ? '#43C6AC' : '#E040FB' }}>
                  {item.done ? '✓ Completed' : '● Pending'}
              </Text>
            </View>
          )} 
        </View>
      </Pressable>
    );
  };

  const renderFormContent = () => {
    const isNew = !detailItem;
    const viewMode = !isNew && !isEditing;
    const currentType = detailItem ? detailItem.type : activeSection;
    const commonProps = { viewMode, showPassword, setShowPassword, colors, form, setForm };

    const handleSecurePasswordToggle = async () => {
    if (!showPassword) {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to view password',
        fallbackLabel: 'Use Device Passcode',
      });
      if (auth.success) setShowPassword(true);
      else showCustomAlert("Authentication Failed", "You must authenticate to view this secure data.", "danger");
    } else {
      setShowPassword(false);
    }
  };

    const dateKey = currentType === 'events' ? 'eventDate' : 'remindAt';
    const displayDate = form[dateKey] ? new Date(form[dateKey]) : new Date();

    switch (currentType) {
      case 'notes': return (
        <>
          <Field label="Title" value={form.title} key_="title" placeholder="Note title" {...commonProps} />
          <Field label="Content" value={form.content} key_="content" placeholder="Write your note…" multiline {...commonProps} />
        </>
      );
      case 'passwords': return (
        <>
          <Field label="Site / App Name" value={form.title} key_="title" placeholder="e.g. Google, Netflix" {...commonProps} />
          <Field label="Username / Email" value={form.username} key_="username" placeholder="your@email.com" {...commonProps} />
          <Field label="Password" value={form.password} key_="password" placeholder="••••••••" secureEntry {...commonProps} onTogglePassword={handleSecurePasswordToggle} />
          <Field label="URL (optional)" value={form.url} key_="url" placeholder="https://" keyboardType="url" {...commonProps} />
        </>
      );
      case 'events':
      case 'reminders': return (
        <>
          <Field label="Title" value={form.title} key_="title" placeholder="Subject..." {...commonProps} />
          
          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Schedule</Text>
            {viewMode ? (
              <View style={[styles.fieldView, { borderColor: colors.borderColor }]}>
                <Text style={{ color: colors.text }}>{formatDateTime(displayDate.getTime())}</Text>
              </View>
            ) : (
              <Pressable 
                onPress={() => {
                  haptic();
                  setIsDatePickerOpen(true); // Triggers the new modal
                }} 
                style={[styles.inputRow, { borderColor: colors.borderColor, paddingVertical: 12 }]}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={{ color: colors.text, marginLeft: 10, fontSize: 16 }}>
                  {formatDateTime(displayDate.getTime())}
                </Text>
              </Pressable>
            )}
          </View>

          <Field label="Notes" value={currentType === 'events' ? form.description : form.note} key_={currentType === 'events' ? 'description' : 'note'} placeholder="Add details…" multiline {...commonProps} />
          
          {viewMode && currentType === 'reminders' && (
            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Status</Text>
              <View style={styles.switchRow}>
                <Text style={{ color: colors.text, fontSize: 16 }}>{form.done ? 'Completed ✓' : 'Active Task'}</Text>
                <Switch value={form.done || false} onValueChange={v => { setForm(f => ({ ...f, done: v })); toggleReminderStatus(detailItem, v); }} trackColor={{ true: '#43C6AC' }} />
              </View>
            </View>
          )}

          {/* THE NEW STABLE DATE PICKER MODAL */}
          <DatePicker
            modal
            open={isDatePickerOpen}
            date={displayDate}
            mode="datetime"
            theme={activeTheme === 'dark' ? 'dark' : 'light'}
            onConfirm={(date) => {
              setIsDatePickerOpen(false); // Closes modal
              const key = currentType === 'events' ? 'eventDate' : 'remindAt';
              setForm(f => ({ ...f, [key]: date.toISOString() })); // Saves date
            }}
            onCancel={() => {
              setIsDatePickerOpen(false); // Closes modal on cancel
            }}
          />
        </>
      );
      case 'passkeys': return (
        <>
          <Field label="Account Name" value={form.title} key_="title" placeholder="e.g. GitHub, Gmail" {...commonProps} />
          <Field label="Account / Email" value={form.account} key_="account" placeholder="your@email.com" {...commonProps} />
          <Field label="Secret Key" value={form.secret} key_="secret" placeholder="JBSWY3DPEHPK3PXP" secureEntry {...commonProps} onTogglePassword={handleSecurePasswordToggle} />
        </>
      );
      default: return null;
    }
  };

  const sc = SECTIONS.find(s => s.id === activeSection);

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerText, { color: colors.text }]}>{sc?.label}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 13, marginLeft: 20 }}>{currentData.length} total entries</Text>
          </View>
          <View style={styles.actionIcons}>
            <Pressable onPress={() => { setIsNewestFirst(!isNewestFirst); haptic(); }} style={styles.iconButton}><Ionicons name={isNewestFirst ? "arrow-down" : "arrow-up"} size={22} color={sc?.color} /></Pressable>
            <Pressable onPress={() => { setIsGridView(!isGridView); haptic(); }} style={styles.iconButton}><Ionicons name={isGridView ? "list" : "grid"} size={22} color={sc?.color} /></Pressable>
          </View>
        </View>
        {/* 2. UPDATED TAB BAR */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabScrollView} 
          contentContainerStyle={styles.tabBar}
        >
          {SECTIONS.map(s => {
            const isActive = activeSection === s.id;
            return (
              <Pressable 
                key={s.id} 
                onPress={() => { haptic(); setActiveSection(s.id); }} 
                style={[
                  styles.tab, 
                  { 
                    backgroundColor: isActive 
                      ? (activeTheme === 'dark' ? s.color + '25' : s.color + '15')
                      : colors.card,
                    borderColor: isActive 
                      ? s.color 
                      : colors.borderColor,
                  }
                ]}
              >
                <Ionicons 
                  name={isActive ? s.filledIcon : s.icon} 
                  size={16} 
                  color={isActive ? s.color : colors.textMuted} 
                />
                <Text style={[
                  styles.tabLabel, 
                  { 
                    color: isActive ? s.color : colors.textMuted, 
                    fontWeight: isActive ? '700' : '600' 
                  }
                ]}>
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView contentContainerStyle={[isGridView ? styles.gridBody : styles.scrollBody, { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
          {currentData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name={sc?.icon} size={72} color={sc?.color + '30'} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nothing here yet.{"\n"}Tap + to secure your first item.</Text>
            </View>
          ) : (
            currentData.map(item => renderCard(item))
          )}
        </ScrollView>
      </SafeAreaView>

      <Pressable style={[styles.fab, { backgroundColor: activeSection === 'all' ? colors.primary : sc?.color }]} onPress={openFab}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
      <PasswordGeneratorModal onSaved={(updatedPasswords) => setPasswords(updatedPasswords)} />

      <Modal visible={isModalVisible} transparent animationType="none" onRequestClose={closeFab}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => closeFab()}><View style={styles.backdropTouchable} /></TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }, Platform.OS === 'android' && { backgroundColor: colors.card }]}>
            {Platform.OS === 'ios' && <BlurView intensity={80} tint={activeTheme} style={StyleSheet.absoluteFill} />}
            <Text style={[styles.sheetTitle, { color: colors.text }]}>What would you like to secure?</Text>
            <View style={styles.optionGrid}>
              {SECTIONS.filter(s => s.id !== 'all').map(s => (
                <Pressable key={s.id} android_ripple={{ color: s.color + '33' }} style={({ pressed }) => [styles.optionCell, { opacity: pressed ? 0.6 : 1 }]} onPress={() => openCreateForm(s.id)}>
                  <View style={[styles.optionIconBg, { backgroundColor: s.color + '20' }]}><Ionicons name={s.filledIcon} size={26} color={s.color} /></View>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>

{/* PHASE 2: BOTTOM SHEET DETAIL MODAL */}
      <Modal visible={isDetailVisible} transparent animationType="slide" onRequestClose={() => setIsDetailVisible(false)}>
        <View style={styles.detailBackdrop}>
          
          {/* 1. Tap outside to close */}
          <TouchableWithoutFeedback onPress={() => setIsDetailVisible(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          <KeyboardAvoidingView style={styles.detailSheetWrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.detailSheet, { backgroundColor: colors.background }]}>
              
              {/* 2. Drag Handle with PanResponder attached */}
              <View style={styles.sheetHandleContainer} {...panResponder.panHandlers}>
                <View style={[styles.sheetHandle, { backgroundColor: colors.textMuted + '40' }]} />
              </View>

              {/* Sheet Header */}
              <View style={[styles.detailHeader, { borderBottomColor: colors.borderColor }]}>
                <Pressable onPress={() => {
                  setIsDetailVisible(false);
                  SecureStorage.clearDraft();
                }}
                  style={styles.headerBtn}>
                    <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: '500' }}>Cancel</Text>
                </Pressable>
                
                <View style={styles.detailHeaderCenter}>
                 
                  <Text style={[styles.detailHeaderTitle, { color: colors.text }]}>
                      {detailItem ? (isEditing ? 'Edit' : '') : 'New'} {SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.label}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {detailItem && !isEditing && (
                      <Pressable onPress={handleDelete} style={[styles.headerBtn, { marginRight: 12 }]}>
                          <Ionicons name="trash-outline" size={20} color="#FF6584" />
                      </Pressable>
                  )}
                  {detailItem && !isEditing ? (
                    <Pressable onPress={() => setIsEditing(true)} style={styles.headerBtn}>
                      <Text style={{ color: SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.color, fontWeight: '600', fontSize: 16 }}>Edit</Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={handleSave} style={styles.headerBtn}>
                      <Text style={{ color: SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.color, fontWeight: '700', fontSize: 16 }}>Save</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              
              {/* Form Content */}
              <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: Platform.OS === 'ios' ? 100 : 60 }} showsVerticalScrollIndicator={false}>
                {renderFormContent()}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>


      {/* PHASE 2.5: GLASSY CUSTOM THEMED ALERT MODAL */}
      <Modal 
        visible={alertState.visible} 
        transparent 
        animationType="fade"
        statusBarTranslucent={true}
      >
        {/* Custom Alert Component */}
          <CustomAlert
            visible={alertState.visible}
            title={alertState.title}
            message={alertState.message}
            type={alertState.type}
            onConfirm={() => {
              if (alertState.onConfirm) alertState.onConfirm();
              hideAlert();
            }}
            onCancel={hideAlert}
            confirmText={alertState.confirmText}
            showCancel={alertState.showCancel}
            theme={activeTheme}
          />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: 20, marginTop: 10, marginBottom: 4 },
  headerText: { fontSize: 30, fontWeight: 'bold', marginHorizontal: 20 },
  actionIcons: { flexDirection: 'row', marginTop: 4 },
  iconButton: { marginLeft: 14, padding: 6 },
  tabLabel: { fontSize: 13, fontWeight: '600',letterSpacing: -0.2 },
  scrollBody: { paddingHorizontal: 20 },
  gridBody: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 14, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset:{width:0,height:2}},
  gridCard: { width: '48%', padding: 18, borderRadius: 16, marginBottom: 14, alignItems: 'center', elevation: 1,shadowColor:'#000',shadowOpacity:0.05,shadowOffset:{width:0,height:2},shadowRadius:8 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center'},
  cardTitle: { fontSize: 16, fontWeight: '600', flexShrink: 1, marginRight: 8, letterSpacing: -0.3 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width:"100%" },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8},
  doneBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 5 },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', marginTop: 18, fontSize: 16, lineHeight: 26 },
  fab: { position: 'absolute', right: 24, bottom: 28, width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  backdropTouchable: { flex: 1 },
  bottomSheet: { padding: 24, paddingBottom: 36, borderTopLeftRadius: 35, borderTopRightRadius: 35, overflow: 'hidden' },
  sheetTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  optionCell: { width: '33.33%', alignItems: 'center', paddingVertical: 14 },
  optionIconBg: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  optionLabel: { fontSize: 12, fontWeight: '600' },
  detailMain: { flex: 1 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth:StyleSheet.hairlineWidth },
  detailHeaderCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailHeaderTitle: { fontSize: 17, fontWeight: '700' },
  headerBtn: { padding: 8 },
  accentBar: { height: 3, width: '100%' },
  fieldWrap: { marginBottom: 20 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginLeft: 6, marginBottom: 8, letterSpacing: 0.5 },
  fieldView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 16 },
  fieldViewText: { fontSize: 16, flex: 1,lineHeight:24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios'?14:4 },
  input: { fontSize: 16, paddingVertical: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  selectorBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1.5 },

  // --- BOTTOM SHEET STYLES ---
  detailBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dims the feed behind the sheet
  },
  detailSheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailSheet: {
    height: '85%', // Covers most of the screen but leaves the top visible
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },

  // --- GLASSY CUSTOM ALERT STYLES ---
alertBackdrop: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
  backgroundColor: 'rgba(0, 0, 0, 0.69)',
},
alertWrapper: {
  width: '100%',
  maxWidth: 340,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
alertCard: {
  width: '100%',
  borderRadius: 28,
  padding: 28,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.2,
  shadowRadius: 30,
  elevation: 20,
  overflow: 'hidden',
},
alertIconBg: {
  width: 64,
  height: 64,
  borderRadius: 32,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 16,
  zIndex: 1,
},
alertTitle: {
  fontSize: 20,
  color:'red',
  fontWeight: '700',
  marginBottom: 8,
  textAlign: 'center',
  zIndex: 1,
  letterSpacing: -0.3,
},
alertMessage: {
  fontSize: 14,
  lineHeight: 22,
  textAlign: 'center',
  marginBottom: 24,
  paddingHorizontal: 10,
  zIndex: 1,
},
alertButtonGroup: {
  flexDirection: 'row',
  width: '100%',
  gap: 10,
  zIndex: 1,
},
alertBtn: {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
},
alertBtnCancel: {
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.08)',
},
alertBtnConfirm: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
},
alertBtnText: {
  fontSize: 15,
  fontWeight: '600',
  letterSpacing: -0.2,
},

  tabScrollView: {
  maxHeight: 56,
  minHeight: 56,
  flexShrink: 0,
},
tabBar: {
  paddingHorizontal: 20,
  alignItems: 'center',
  gap: 8,
},
tab: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 8,
  gap: 6,
  borderRadius: 12,
  borderWidth: 1,
  // Subtle shadow for clean depth without muddy artifacts
  shadowColor: '#00000046',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 2,
  elevation: 1,
},

});