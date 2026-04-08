/**
 * Project: Secure Notes
 * Component: ShareApp.js
 * Developer: Raju
 */

import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Share, 
  Platform, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext'; //
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg'; // For high-end QR rendering
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ShareApp() {
  const { colors } = useContext(ThemeContext);
  
  // Your specific GitHub Package URL
  const GITHUB_REPO = "https://www.github.com/raju-07/secure-notes";

  const triggerShareSheet = async () => {
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const result = await Share.share({
        title: 'Secure Notes',
        message: `Secure your digital life with Secure Notes. Built with privacy in mind by BioStack. Check out the source on GitHub: ${GITHUB_REPO}`,
        url: GITHUB_REPO, // Essential for iOS rich previews
      });

      if (result.action === Share.sharedAction) {
        // Native interaction tracking
        console.log("App Shared successfully");
      }
    } catch (error) {
      console.error("Share error:", error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.main, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Visual Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.iconShield, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="share-social" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Secure Notes</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Spread the word about the most private note-taking experience for BCA students and beyond.
          </Text>
        </View>

        {/* The Installation Card */}
        <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
          
          <View style={styles.cardInfo}>
            <View style={styles.versionPill}>
              <Text style={styles.versionText}>STABLE v1.0.0</Text>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Install Now</Text>
          </View>

          {/* ACTIVE QR CODE GENERATOR */}
          <View style={styles.qrWrapper}>
            <QRCode
              value={GITHUB_REPO}
              size={180}
              color={colors.text}
              backgroundColor={colors.card}
              logo={require('../../assets/_Shield_Logo.png')} // Replace with your app logo
              logoSize={40}
              logoBorderRadius={10}
            />
            <View style={[styles.qrOverlay, { backgroundColor: colors.primary }]}>
              <Text style={styles.overlayText}>SCAN TO GITHUB</Text>
            </View>
          </View>

          <Text style={[styles.repoLink, { color: colors.primary }]}>
            raju-07/secure-notes
          </Text>
        </View>

        {/* Feature List (Makes the page look complete) */}
        <View style={styles.features}>
          <View style={styles.featRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[styles.featText, { color: colors.textMuted }]}>Hardware-level Encryption</Text>
          </View>
          <View style={styles.featRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[styles.featText, { color: colors.textMuted }]}>No Data Tracking</Text>
          </View>
          <View style={styles.featRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[styles.featText, { color: colors.textMuted }]}>Open Source on GitHub</Text>
          </View>
        </View>

        {/* NATIVE SHARE TRIGGER */}
        <TouchableOpacity 
          style={[styles.shareBtn, { backgroundColor: colors.primary }]} 
          onPress={triggerShareSheet}
          activeOpacity={0.8}
        >
          <Ionicons name="paper-plane" size={24} color="#FFF" />
          <Text style={styles.btnText}>Send Invitation</Text>
        </TouchableOpacity>

        <Text style={[styles.socialCaption, { color: colors.textMuted }]}>
          Supports: WhatsApp, IMO, Messenger, and more.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: { padding: 30, alignItems: 'center' },
  hero: { alignItems: 'center', marginBottom: 40 },
  iconShield: { width: 110, height: 110, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 15 },
  glassCard: { width: '100%', padding: 35, borderRadius: 45, borderWidth: 1.5, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
  cardInfo: { alignItems: 'center', marginBottom: 25 },
  versionPill: { backgroundColor: '#FBBF24', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  versionText: { fontSize: 10, fontWeight: '900', color: '#000' },
  cardTitle: { fontSize: 24, fontWeight: '800' },
  qrWrapper: { padding: 20, borderRadius: 30, backgroundColor: 'white', position: 'relative', elevation: 5 },
  qrOverlay: { position: 'absolute', bottom: -10, alignSelf: 'center', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 8 },
  overlayText: { color: 'white', fontSize: 10, fontWeight: '900' },
  repoLink: { marginTop: 35, fontSize: 13, fontWeight: '700', textTransform: 'lowercase' },
  features: { width: '100%', marginVertical: 40, gap: 12 },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featText: { fontSize: 14, fontWeight: '600' },
  shareBtn: { width: '100%', height: 75, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  btnText: { color: '#FFF', fontSize: 20, fontWeight: '900', marginLeft: 15 },
  socialCaption: { marginTop: 20, fontSize: 12, fontWeight: '700', opacity: 0.6 }
});