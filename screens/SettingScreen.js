import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  
  const SettingItem = ({ icon, title, onPress, color = "#475569", isLast = false }) => (
    <TouchableOpacity 
      style={[styles.item, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.borderColor + '40' }]} 
      onPress={onPress} 
      activeOpacity={0.6}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          <Text style={[styles.headerText, { color: colors.text }]}>Settings</Text>

          <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
            <SettingItem icon="lock-closed-outline" title="Lock App" color='#10B981' onPress={() => navigation.navigate("Lock")} />
            <SettingItem icon="color-palette-outline" title="Theme" color='#FF00AA' onPress={() => navigation.navigate("Theme")} />
            <SettingItem icon="timer-outline" title="Session" color='#F59E0B' onPress={() => navigation.navigate("Session")} />
            <SettingItem icon="shield-outline" title="Encryption" color="#6366F1" onPress={() => navigation.navigate("Encryption")} />
            <SettingItem icon="information-circle-outline" title="About Us" color="#3B82F6" onPress={() => navigation.navigate("About")} />
            <SettingItem icon="chatbubble-ellipses-outline" title="Feedback" color="#06B6D4" onPress={() => navigation.navigate("Feedback")} />
            <SettingItem icon="share-social-outline" title="Share App" color="#8B5CF6" onPress={() => navigation.navigate("Share")} isLast={true} />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>
              Secure Notes v{Constants.expoConfig.version}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  scrollBody: { paddingBottom: 40 },
  headerText: {
    fontSize: 32,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
  },
  group: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden', 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  title: { fontSize: 16, fontWeight: '500' },
  footer: { marginTop: 30, alignItems: 'center' },
  versionText: { fontSize: 13, fontWeight: '500', opacity: 0.7 },
});