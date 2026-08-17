import React, { useState, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../context/ThemeContext";

const KEYS = {
  PASSWORDS: "@vault_passwords",
};

const SecureStorage = {
  getPasswords: async () => {
    try {
      return JSON.parse(await AsyncStorage.getItem(KEYS.PASSWORDS)) || [];
    } catch {
      return [];
    }
  },
  savePasswords: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.PASSWORDS, JSON.stringify(data));
    } catch {}
  },
};

const haptic = (type = Haptics.ImpactFeedbackStyle.Light) => {
  if (Platform.OS === "ios") Haptics.impactAsync(type);
};

export default function PasswordGeneratorModal({ onSaved }) {
  const { colors } = useContext(ThemeContext);

  const [visible, setVisible] = useState(false);
  const [length, setLength] = useState(8);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  // Only called when the user presses the "Generate Password" button
  const handleGenerate = async () => {
    haptic(Haptics.ImpactFeedbackStyle.Medium);
    let charset = "";
    if (useLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      charset = "abcdefghijklmnopqrstuvwxyz";
      setUseLower(true);
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(result);
    await Clipboard.setStringAsync(result);
    showToast("Copied to clipboard!");
  };

  const getStrength = (pwd) => {
    if (!pwd) return { label: "None", color: colors.textMuted, score: 0 };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: "Weak", color: "#FF6584", score: 33 };
    if (score <= 4) return { label: "Medium", color: "#F7971E", score: 66 };
    return { label: "Strong", color: "#43C6AC", score: 100 };
  };

  const strength = getStrength(generatedPassword);

  const resetForm = () => {
    setTitle("");
    setUsername("");
    setUrl("");
    setGeneratedPassword("");
    setVisible(false);
  };

  const handleSave = async () => {
    if (!generatedPassword) return;

    const ts = Date.now();
    const formattedDate = new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const finalTitle = title.trim() || `Password (${formattedDate})`;

    const newItem = {
      id: ts.toString(),
      type: "passwords",
      title: finalTitle,
      username: username.trim(),
      password: generatedPassword,
      url: url.trim(),
      date: ts,
    };

    const existing = await SecureStorage.getPasswords();
    const updated = [newItem, ...existing];
    await SecureStorage.savePasswords(updated);

    if (onSaved) {
      onSaved(updated);
    }

    haptic(Haptics.ImpactFeedbackStyle.Heavy);
    resetForm();
  };

  return (
    <>
      <Pressable
        style={[styles.fab, { backgroundColor: "#FF6584" }]}
        onPress={() => {
          haptic();
          setVisible(true);
        }}
      >
        <Ionicons name="key" size={24} color="#FFF" />
      </Pressable>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={resetForm}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheetWrapper}
          >
            <View style={[styles.sheet, { backgroundColor: colors.background }]}>
              {/* Header */}
              <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
                <Pressable onPress={resetForm} style={styles.headerBtn}>
                  <Text style={{ color: colors.textMuted, fontSize: 16 }}>Cancel</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Generate Password</Text>
                <Pressable onPress={handleSave} style={styles.headerBtn}>
                  <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16 }}>Save</Text>
                </Pressable>
              </View>

              {/* Toast */}
              <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: colors.card }]}>
                <Ionicons name="checkmark-circle" size={18} color="#43C6AC" />
                <Text style={[styles.toastText, { color: colors.text }]}>{toastMessage}</Text>
              </Animated.View>

              <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Result Display Box */}
                <View style={[styles.passwordCard, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
                  <Text style={[styles.generatedText, { color: colors.text }]} selectable>
                    {generatedPassword || "••••••••"}
                  </Text>
                  <Pressable
                    onPress={async () => {
                      if (!generatedPassword) return;
                      await Clipboard.setStringAsync(generatedPassword);
                      haptic();
                      showToast("Copied to clipboard!");
                    }}
                    style={styles.copyIconBtn}
                  >
                    <Ionicons name="copy-outline" size={20} color={colors.primary} />
                  </Pressable>
                </View>

                {/* Strength Meter Bar */}
                <View style={styles.meterContainer}>
                  <View style={styles.meterLabels}>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>Strength</Text>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: strength.color }}>{strength.label}</Text>
                  </View>
                  <View style={[styles.meterTrack, { backgroundColor: colors.borderColor }]}>
                    <View style={[styles.meterFill, { width: `${strength.score}%`, backgroundColor: strength.color }]} />
                  </View>
                </View>

                {/* Length Slider */}
                <View style={[styles.sliderCard, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
                  <View style={styles.sliderHeader}>
                    <Text style={[styles.controlLabel, { color: colors.text }]}>Length</Text>
                    <Text style={[styles.lengthBadge, { color: colors.primary, backgroundColor: colors.primary + "15" }]}>
                      {length}
                    </Text>
                  </View>
                  <Slider
                    style={{ width: "100%", height: 36 }}
                    minimumValue={6}
                    maximumValue={16}
                    step={1}
                    value={length}
                    onValueChange={(val) => setLength(val)}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.borderColor}
                    thumbTintColor={colors.primary}
                  />
                </View>

                {/* Character Toggles */}
                <View style={[styles.togglesContainer, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleText, { color: colors.text }]}>A-Z (Uppercase)</Text>
                    <Switch
                      value={useUpper}
                      onValueChange={setUseUpper}
                      trackColor={{ true: colors.primary }}
                      style={styles.compactSwitch}
                    />
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleText, { color: colors.text }]}>a-z (Lowercase)</Text>
                    <Switch
                      value={useLower}
                      onValueChange={setUseLower}
                      trackColor={{ true: colors.primary }}
                      style={styles.compactSwitch}
                    />
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleText, { color: colors.text }]}>0-9 (Numbers)</Text>
                    <Switch
                      value={useNumbers}
                      onValueChange={setUseNumbers}
                      trackColor={{ true: colors.primary }}
                      style={styles.compactSwitch}
                    />
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleText, { color: colors.text }]}>!@# (Symbols)</Text>
                    <Switch
                      value={useSymbols}
                      onValueChange={setUseSymbols}
                      trackColor={{ true: colors.primary }}
                      style={styles.compactSwitch}
                    />
                  </View>
                </View>

                {/* Generate Button (The only trigger) */}
                <Pressable onPress={handleGenerate} style={[styles.generateBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="refresh" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.generateBtnText}>Generate Password</Text>
                </Pressable>

                {/* Vault Entry Details */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>VAULT ENTRY DETAILS (OPTIONAL)</Text>

                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Site / App Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.borderColor, color: colors.text }]}
                    placeholder="Defaults to current timestamp"
                    placeholderTextColor={colors.textMuted}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Username / Email</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.borderColor, color: colors.text }]}
                    placeholder="your@email.com"
                    placeholderTextColor={colors.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>URL</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.borderColor, color: colors.text }]}
                    placeholder="https://"
                    placeholderTextColor={colors.textMuted}
                    value={url}
                    onChangeText={setUrl}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 104,
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    height: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  headerBtn: {
    padding: 6,
  },
  toast: {
    position: "absolute",
    top: 55,
    alignSelf: "center",
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 4,
    gap: 6,
  },
  toastText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  passwordCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  generatedText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
    flex: 1,
  },
  copyIconBtn: {
    padding: 6,
    marginLeft: 8,
  },
  meterContainer: {
    marginTop: 10,
    marginBottom: 14,
  },
  meterLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  meterTrack: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: 3,
  },
  sliderCard: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  lengthBadge: {
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  togglesContainer: {
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "500",
  },
  compactSwitch: {
    transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  generateBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  fieldWrap: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
  },
});