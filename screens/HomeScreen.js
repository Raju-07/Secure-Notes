import React, { useContext, useRef, useState, useEffect } from "react";
import {
  StyleSheet, View, Text, ScrollView, Modal, Animated,
  Easing, TouchableWithoutFeedback, Pressable, Platform,
  TextInput, Alert, Switch, KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────────────────────
//  SECURE STORAGE SERVICE 
// ─────────────────────────────────────────────────────────────
const KEYS = {
  NOTES: "@vault_notes",
  PASSWORDS: "@vault_passwords",
  EVENTS: "@vault_events",
  PASSKEYS: "@vault_passkeys",
  REMINDERS: "@vault_reminders",
};

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
};

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
const haptic = () => { if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); };
const formatDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const formatDateTime = (ts) => new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const generateTOTP = (secret) => {
  const time = Math.floor(Date.now() / 30000);
  let hash = 0;
  const str = secret + time;
  for (let i = 0; i < str.length; i++) { hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0; }
  return String(Math.abs(hash) % 1000000).padStart(6, '0');
};

// ─────────────────────────────────────────────────────────────
//  SECTION CONFIG
// ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'all',       label: 'All',      icon: 'grid-outline',           filledIcon: 'grid',               color: '#6366F1' },
  { id: 'notes',     label: 'Notes',    icon: 'document-text-outline',  filledIcon: 'document-text',      color: '#6C63FF' },
  { id: 'passwords', label: 'Password', icon: 'lock-closed-outline',    filledIcon: 'lock-closed',         color: '#FF6584' },
  { id: 'events',    label: 'Events',   icon: 'calendar-outline',       filledIcon: 'calendar',            color: '#43C6AC' },
  { id: 'passkeys',  label: 'PassKey',  icon: 'key-outline',            filledIcon: 'key',                 color: '#F7971E' },
  { id: 'reminders', label: 'Remind',   icon: 'alarm-outline',          filledIcon: 'alarm',               color: '#E040FB' },
];

// ─────────────────────────────────────────────────────────────
//  STABLE FIELD COMPONENT (Fixes Keyboard Issue)
// ─────────────────────────────────────────────────────────────
const Field = ({ label, value, key_, placeholder, multiline, secureEntry, keyboardType, viewMode, showPassword, setShowPassword, colors, form, setForm }) => (
  <View style={styles.fieldWrap}>
    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{label}</Text>
    {viewMode ? (
      <View style={[styles.fieldView, { borderColor: colors.borderColor }]}>
        <Text style={[styles.fieldViewText, { color: colors.text }]} selectable>
          {secureEntry && !showPassword ? '••••••••••' : (value || '—')}
        </Text>
        {secureEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    ) : (
      <View style={[styles.inputRow, { borderColor: colors.borderColor }]}>
        <TextInput
          style={[styles.input, { color: colors.text, flex: 1 }]}
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
          <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    )}
  </View>
);

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
  const [totpCode,         setTotpCode]         = useState('');
  const [totpSeconds,      setTotpSeconds]      = useState(30);

  const slideAni = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      setNotes(await SecureStorage.getNotes());
      setPasswords(await SecureStorage.getPasswords());
      setEvents(await SecureStorage.getEvents());
      setPasskeys(await SecureStorage.getPassKeys());
      setReminders(await SecureStorage.getReminders());
    })();
  }, []);

  useEffect(() => {
    if (activeSection !== 'passkeys' && activeSection !== 'all' && !isDetailVisible) return;
    const tick = () => {
      const secs = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTotpSeconds(secs);
      if (detailItem?.secret) setTotpCode(generateTOTP(detailItem.secret));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeSection, isDetailVisible, detailItem]);

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
      if (sectionId !== 'all') setActiveSection(sectionId);
      setTimeout(() => setIsDetailVisible(true), 100);
    });
  };

  const openDetail = (item) => {
    haptic();
    setDetailItem(item);
    setForm({ ...item });
    setIsEditing(false);
    setShowPassword(false);
    if (item.secret) setTotpCode(generateTOTP(item.secret));
    setIsDetailVisible(true);
  };

  const handleSave = async () => {
    const ts = Date.now();
    // Determine section if we are in 'All' view
    const sectionToSave = detailItem ? detailItem.type : activeSection;
    
    switch (sectionToSave) {
      case 'notes': {
        if (!form.title?.trim()) return Alert.alert('Title required');
        const entry = { id: detailItem?.id || ts.toString(), type: 'notes', title: form.title, content: form.content || '', date: detailItem?.date || ts };
        const list = detailItem ? notes.map(n => n.id === entry.id ? entry : n) : [entry, ...notes];
        await SecureStorage.saveNotes(list); setNotes(list); break;
      }
      case 'passwords': {
        if (!form.title?.trim()) return Alert.alert('Site/App name required');
        const entry = { id: detailItem?.id || ts.toString(), type: 'passwords', title: form.title, username: form.username || '', password: form.password || '', url: form.url || '', date: detailItem?.date || ts };
        const list = detailItem ? passwords.map(p => p.id === entry.id ? entry : p) : [entry, ...passwords];
        await SecureStorage.savePasswords(list); setPasswords(list); break;
      }
      case 'events': {
        if (!form.title?.trim()) return Alert.alert('Event title required');
        const entry = { id: detailItem?.id || ts.toString(), type: 'events', title: form.title, location: form.location || '', description: form.description || '', eventDate: form.eventDate || new Date().toISOString().slice(0,16), date: detailItem?.date || ts };
        const list = detailItem ? events.map(e => e.id === entry.id ? entry : e) : [entry, ...events];
        await SecureStorage.saveEvents(list); setEvents(list); break;
      }
      case 'passkeys': {
        if (!form.title?.trim() || !form.secret?.trim()) return Alert.alert('Name and Secret required');
        const entry = { id: detailItem?.id || ts.toString(), type: 'passkeys', title: form.title, account: form.account || '', secret: form.secret, date: detailItem?.date || ts };
        const list = detailItem ? passkeys.map(p => p.id === entry.id ? entry : p) : [entry, ...passkeys];
        await SecureStorage.savePassKeys(list); setPasskeys(list); break;
      }
      case 'reminders': {
        if (!form.title?.trim()) return Alert.alert('Reminder title required');
        const entry = { id: detailItem?.id || ts.toString(), type: 'reminders', title: form.title, note: form.note || '', remindAt: form.remindAt || new Date().toISOString().slice(0,16), done: detailItem?.done || false, date: detailItem?.date || ts };
        const list = detailItem ? reminders.map(r => r.id === entry.id ? entry : r) : [entry, ...reminders];
        await SecureStorage.saveReminders(list); setReminders(list); break;
      }
    }
    setIsDetailVisible(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          const id = detailItem.id;
          const sectionToDelete = detailItem.type || activeSection;
          switch (sectionToDelete) {
            case 'notes': { const l = notes.filter(x => x.id !== id); await SecureStorage.saveNotes(l); setNotes(l); break; }
            case 'passwords': { const l = passwords.filter(x => x.id !== id); await SecureStorage.savePasswords(l); setPasswords(l); break; }
            case 'events': { const l = events.filter(x => x.id !== id); await SecureStorage.saveEvents(l); setEvents(l); break; }
            case 'passkeys': { const l = passkeys.filter(x => x.id !== id); await SecureStorage.savePassKeys(l); setPasskeys(l); break; }
            case 'reminders': { const l = reminders.filter(x => x.id !== id); await SecureStorage.saveReminders(l); setReminders(l); break; }
          }
          setIsDetailVisible(false);
      }}
    ]);
  };

  const toggleReminder = async (item) => {
    const updated = { ...item, done: !item.done };
    const list = reminders.map(r => r.id === item.id ? updated : r);
    await SecureStorage.saveReminders(list); setReminders(list);
  };

  // ── Aggregated Data Logic ──
  const currentData = (() => {
    if (activeSection === 'all') {
      const combined = [
        ...notes.map(i => ({ ...i, type: 'notes' })),
        ...passwords.map(i => ({ ...i, type: 'passwords' })),
        ...events.map(i => ({ ...i, type: 'events' })),
        ...passkeys.map(i => ({ ...i, type: 'passkeys' })),
        ...reminders.map(i => ({ ...i, type: 'reminders' })),
      ];
      return combined.sort((a, b) => isNewestFirst ? b.date - a.date : a.date - b.date);
    }
    const raw = { notes, passwords, events, passkeys, reminders }[activeSection] || [];
    return [...raw].map(i => ({ ...i, type: activeSection })).sort((a, b) => isNewestFirst ? b.date - a.date : a.date - b.date);
  })();

  const renderCard = (item) => {
    const type = item.type;
    const cfg = SECTIONS.find(s => s.id === type) || SECTIONS[1];
    const subtitle = (() => {
      if (type === 'passwords') return item.username || 'No username';
      if (type === 'events')    return formatDateTime(item.eventDate ? new Date(item.eventDate).getTime() : item.date);
      if (type === 'passkeys')  return item.account || 'No account';
      if (type === 'reminders') return item.remindAt ? formatDateTime(new Date(item.remindAt).getTime()) : '';
      return formatDate(item.date);
    })();

    return (
      <Pressable
        key={item.id}
        onPress={() => { setActiveSection(type); openDetail(item); }}
        android_ripple={{ color: cfg.color + '22' }}
        style={({ pressed }) => [
          isGridView ? styles.gridCard : styles.card,
          { backgroundColor: colors.card, borderColor: colors.borderColor, opacity: pressed ? 0.85 : 1 }
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: cfg.color + '20', marginBottom: isGridView ? 12 : 0, marginRight: isGridView ? 0 : 15 }]}>
          <Ionicons name={cfg.filledIcon} size={22} color={cfg.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }} numberOfLines={1}>{subtitle}</Text>
          {type === 'reminders' && (
            <View style={[styles.doneBadge, { backgroundColor: item.done ? '#43C6AC22' : '#E040FB22' }]}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: item.done ? '#43C6AC' : '#E040FB' }}>{item.done ? '✓ Done' : '● Pending'}</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginLeft: 8 }} />
      </Pressable>
    );
  };

  const renderFormContent = () => {
    const isNew = !detailItem;
    const viewMode = !isNew && !isEditing;
    const currentType = detailItem ? detailItem.type : activeSection;

    const commonProps = { viewMode, showPassword, setShowPassword, colors, form, setForm };

    switch (currentType) {
      case 'notes': return (
        <>
          <Field label="Title" value={form.title} key_="title" placeholder="Note title" {...commonProps} />
          <Field label="Content" value={form.content} key_="content" placeholder="Write your secure note…" multiline {...commonProps} />
        </>
      );
      case 'passwords': return (
        <>
          <Field label="Site / App Name" value={form.title} key_="title" placeholder="e.g. Google, Netflix" {...commonProps} />
          <Field label="Username / Email" value={form.username} key_="username" placeholder="your@email.com" {...commonProps} />
          <Field label="Password" value={form.password} key_="password" placeholder="••••••••" secureEntry {...commonProps} />
          <Field label="URL (optional)" value={form.url} key_="url" placeholder="https://" keyboardType="url" {...commonProps} />
        </>
      );
      case 'events': return (
        <>
          <Field label="Event Title" value={form.title} key_="title" placeholder="e.g. Team Meeting" {...commonProps} />
          <Field label="Date & Time" value={form.eventDate} key_="eventDate" placeholder="YYYY-MM-DDTHH:MM" {...commonProps} />
          <Field label="Location" value={form.location} key_="location" placeholder="Add a location" {...commonProps} />
          <Field label="Description" value={form.description} key_="description" placeholder="Event details…" multiline {...commonProps} />
        </>
      );
      case 'passkeys': return (
        <>
          <Field label="Account Name" value={form.title} key_="title" placeholder="e.g. GitHub, Gmail" {...commonProps} />
          <Field label="Account / Email" value={form.account} key_="account" placeholder="your@email.com" {...commonProps} />
          <Field label="Secret Key" value={form.secret} key_="secret" placeholder="JBSWY3DPEHPK3PXP" secureEntry {...commonProps} />
          {(viewMode && form.secret) && (
            <View style={styles.totpBox}>
              <Text style={[styles.totpCode, { color: SECTIONS.find(s => s.id === 'passkeys').color }]}>{totpCode.slice(0, 3)} {totpCode.slice(3)}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Refreshes in {totpSeconds}s</Text>
              <View style={[styles.totpBar, { backgroundColor: colors.borderColor }]}>
                <View style={[styles.totpProgress, { backgroundColor: SECTIONS.find(s => s.id === 'passkeys').color, width: `${(totpSeconds / 30) * 100}%` }]} />
              </View>
            </View>
          )}
        </>
      );
      case 'reminders': return (
        <>
          <Field label="Reminder Title" value={form.title} key_="title" placeholder="What to remember?" {...commonProps} />
          <Field label="Date & Time" value={form.remindAt} key_="remindAt" placeholder="YYYY-MM-DDTHH:MM" {...commonProps} />
          <Field label="Note" value={form.note} key_="note" placeholder="Extra details…" multiline {...commonProps} />
          {viewMode && detailItem && (
            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Status</Text>
              <View style={styles.switchRow}>
                <Text style={{ color: colors.text, fontSize: 16 }}>{form.done ? 'Done ✓' : 'Pending'}</Text>
                <Switch value={form.done || false} onValueChange={v => { setForm(f => ({ ...f, done: v })); toggleReminder({ ...detailItem, done: v }); }} trackColor={{ true: '#43C6AC' }} />
              </View>
            </View>
          )}
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
            <Text style={{ color: colors.textMuted, fontSize: 13, marginLeft: 20 }}>{currentData.length} {currentData.length === 1 ? 'item' : 'items'} stored</Text>
          </View>
          <View style={styles.actionIcons}>
            <Pressable onPress={() => setIsNewestFirst(v => !v)} style={styles.iconButton}><Ionicons name={isNewestFirst ? "arrow-down" : "arrow-up"} size={22} color={sc?.color} /></Pressable>
            <Pressable onPress={() => setIsGridView(v => !v)} style={styles.iconButton}><Ionicons name={isGridView ? "list" : "grid"} size={22} color={sc?.color} /></Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60 }} contentContainerStyle={styles.tabBar}>
          {SECTIONS.map(s => (
            <Pressable key={s.id} onPress={() => { haptic(); setActiveSection(s.id); }} style={[styles.tab, activeSection === s.id && { backgroundColor: s.color + '20', borderColor: s.color }]}>
              <Ionicons name={activeSection === s.id ? s.filledIcon : s.icon} size={16} color={activeSection === s.id ? s.color : colors.textMuted} />
              <Text style={[styles.tabLabel, { color: activeSection === s.id ? s.color : colors.textMuted }]}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={[isGridView ? styles.gridBody : styles.scrollBody, { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
          {currentData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name={sc?.icon} size={72} color={sc?.color + '30'} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No {sc?.label} yet.{"\n"}Tap + to add one.</Text>
            </View>
          ) : (
            currentData.map(item => renderCard(item))
          )}
        </ScrollView>
      </SafeAreaView>

      <Pressable style={[styles.fab, { backgroundColor: activeSection === 'all' ? colors.primary : sc?.color }]} onPress={openFab}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      <Modal visible={isModalVisible} transparent animationType="none" onRequestClose={closeFab}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => closeFab()}><View style={styles.backdropTouchable} /></TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }, Platform.OS === 'android' && { backgroundColor: colors.card }]}>
            {Platform.OS === 'ios' && <BlurView intensity={80} tint={activeTheme} style={StyleSheet.absoluteFill} />}
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Add New Item</Text>
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

      <Modal visible={isDetailVisible} animationType="slide" onRequestClose={() => setIsDetailVisible(false)}>
        <KeyboardAvoidingView style={[styles.detailMain, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.detailHeader, { borderBottomColor: colors.borderColor }]}>
              <Pressable onPress={() => setIsDetailVisible(false)} style={styles.headerBtn}><Ionicons name="chevron-down" size={24} color={colors.text} /></Pressable>
              <View style={styles.detailHeaderCenter}>
                <Ionicons name={SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.filledIcon} size={18} color={SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.color} />
                <Text style={[styles.detailHeaderTitle, { color: colors.text }]}>{detailItem ? (isEditing ? 'Edit' : 'View') : 'New'} {SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {detailItem && !isEditing && (<Pressable onPress={handleDelete} style={[styles.headerBtn, { marginRight: 4 }]}><Ionicons name="trash-outline" size={20} color="#FF6584" /></Pressable>)}
                {detailItem && !isEditing ? (
                  <Pressable onPress={() => setIsEditing(true)} style={styles.headerBtn}><Text style={{ color: SECTIONS.find(s => s.id === detailItem.type)?.color, fontWeight: '700', fontSize: 16 }}>Edit</Text></Pressable>
                ) : (
                  <Pressable onPress={handleSave} style={styles.headerBtn}><Text style={{ color: SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.color, fontWeight: '700', fontSize: 16 }}>Save</Text></Pressable>
                )}
              </View>
            </View>
            <View style={[styles.accentBar, { backgroundColor: SECTIONS.find(s => s.id === (detailItem?.type || activeSection))?.color }]} />
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
              {renderFormContent()}
              {detailItem && <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 20, textAlign: 'center' }}>Created {formatDate(detailItem.date)}</Text>}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
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
  tabBar: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: 'transparent' },
  tabLabel: { fontSize: 13, fontWeight: '600' },
  scrollBody: { paddingHorizontal: 20 },
  gridBody: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, borderWidth: 1 },
  gridCard: { width: '48%', padding: 18, borderRadius: 16, marginBottom: 14, alignItems: 'center', elevation: 2, borderWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  doneBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 5 },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', marginTop: 18, fontSize: 16, lineHeight: 26 },
  fab: { position: 'absolute', right: 24, bottom: 28, width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  backdropTouchable: { flex: 1 },
  bottomSheet: { padding: 24, paddingBottom: 36, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  optionCell: { width: '33.33%', alignItems: 'center', paddingVertical: 14 },
  optionIconBg: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  optionLabel: { fontSize: 12, fontWeight: '600' },
  detailMain: { flex: 1 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  detailHeaderCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailHeaderTitle: { fontSize: 17, fontWeight: '700' },
  headerBtn: { padding: 8 },
  accentBar: { height: 3, width: '100%' },
  fieldWrap: { marginBottom: 20 },
  fieldLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  fieldView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderRadius: 12, borderWidth: 1.5 },
  fieldViewText: { fontSize: 16, flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4 },
  input: { fontSize: 16, paddingVertical: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totpBox: { alignItems: 'center', marginTop: 10, padding: 24, borderRadius: 20, backgroundColor: 'rgba(247,151,30,0.08)' },
  totpCode: { fontSize: 44, fontWeight: '900', letterSpacing: 8 },
  totpBar: { height: 4, width: '80%', borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  totpProgress: { height: '100%', borderRadius: 4 },
});