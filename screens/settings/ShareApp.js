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
  ScrollView, 
  Alert,
  Dimensions,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ShareApp() {
  const { colors, activeTheme } = useContext(ThemeContext);
  
  const GITHUB_REPO = "https://www.github.com/raju-07/secure-notes";
  const GITHUB_RELEASES = "https://github.com/raju-07/secure-notes/releases";

  const triggerShareSheet = async () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    try {
      const result = await Share.share({
        title: 'Secure Notes',
        message: `Secure your digital life with Secure Notes. Built with privacy in mind. Check out the latest release: ${GITHUB_RELEASES}`,
        url: GITHUB_RELEASES,
      });

      if (result.action === Share.sharedAction) {
        // Shared successfully
      }
    } catch (error) {
      Alert.alert("Share Error", `Error while sharing Application \n${error.message}`);
    }
  };

  const openLink = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const shareViaApp = (app) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Different share URLs for different apps
    const shareText = `Check out Secure Notes - A private note-taking app! ${GITHUB_RELEASES}`;
    const encodedText = encodeURIComponent(shareText);
    
    let url = '';
    switch(app) {
      case 'whatsapp':
        url = Platform.OS === 'ios' 
          ? `whatsapp://send?text=${encodedText}`
          : `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct text sharing via URL
        Alert.alert('Instagram', 'Please copy the link and share manually:\n\n' + GITHUB_RELEASES);
        return;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(GITHUB_RELEASES)}&text=${encodedText}`;
        break;
      case 'copy':
        // Copy to clipboard
        Alert.alert('Copy Link', 'Link copied to clipboard!\n\n' + GITHUB_RELEASES);
        return;
      default:
        triggerShareSheet();
        return;
    }
    
    openLink(url);
  };

  const shareOptions = [
    { 
      icon: 'logo-whatsapp', 
      label: 'WhatsApp', 
      color: '#25D366',
      app: 'whatsapp'
    },
    { 
      icon: 'logo-instagram', 
      label: 'Instagram', 
      color: '#E4405F',
      app: 'instagram'
    },
    { 
      icon: 'logo-twitter', 
      label: 'Twitter', 
      color: '#1DA1F2',
      app: 'twitter'
    },
    { 
      icon: 'paper-plane-outline', 
      label: 'Telegram', 
      color: '#0088cc',
      app: 'telegram'
    },
    { 
      icon: 'link', 
      label: 'Copy Link', 
      color: '#6366F1',
      app: 'copy'
    },
    { 
      icon: 'share-social', 
      label: 'More', 
      color: '#8B5CF6',
      app: 'more'
    },
  ];

  return (
    <SafeAreaView style={[styles.main, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="share-social" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Share Secure Notes</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Spread the word about the most private note-taking experience. 
            Share with your friends and colleagues.
          </Text>
        </View>

        {/* QR Code Card */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="qr-code" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Scan to Install</Text>
          </View>

          <View style={[styles.qrWrapper, { backgroundColor: '#FFFFFF' }]}>
            <QRCode
              value={GITHUB_RELEASES}
              size={width * 0.45}
              color="#000000"
              backgroundColor="#FFFFFF"
              logo={require('../../assets/_Shield_Logo.png')}
              logoSize={40}
              logoBorderRadius={10}
            />
            <View style={[styles.qrOverlay, { backgroundColor: colors.primary }]}>
              <Text style={styles.overlayText}>SCAN TO INSTALL</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => openLink(GITHUB_RELEASES)}
            style={styles.repoLinkContainer}
            activeOpacity={0.7}
          >
            <Ionicons name="git-branch" size={16} color={colors.primary} />
            <Text style={[styles.repoLink, { color: colors.primary }]}>
              View Latest Release
            </Text>
            <Ionicons name="open-outline" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Share Options */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="share" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Share via</Text>
          </View>

          <View style={styles.shareGrid}>
            {shareOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.shareOption}
                onPress={() => shareViaApp(option.app)}
                activeOpacity={0.7}
              >
                <View style={[styles.shareIcon, { backgroundColor: option.color + '15' }]}>
                  <Ionicons name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={[styles.shareLabel, { color: colors.textMuted }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Why Share?</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.featRow}>
              <Ionicons name="lock-closed" size={18} color="#6366F1" />
              <Text style={[styles.featText, { color: colors.textMuted }]}>
                Hardware-level Encryption
              </Text>
            </View>
            <View style={styles.featRow}>
              <Ionicons name="eye-off" size={18} color="#10B981" />
              <Text style={[styles.featText, { color: colors.textMuted }]}>
                No Data Tracking
              </Text>
            </View>
            <View style={styles.featRow}>
              <Ionicons name="logo-github" size={18} color="#F59E0B" />
              <Text style={[styles.featText, { color: colors.textMuted }]}>
                Open Source on GitHub
              </Text>
            </View>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity 
          style={[styles.shareBtn, { backgroundColor: colors.primary }]} 
          onPress={triggerShareSheet}
          activeOpacity={0.8}
        >
          <Ionicons name="paper-plane" size={24} color="#FFF" />
          <Text style={styles.btnText}>Share with Friends</Text>
        </TouchableOpacity>

        <Text style={[styles.socialCaption, { color: colors.textMuted }]}>
          Supports WhatsApp, Instagram, Twitter, Telegram, and more
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: { 
    padding: 20, 
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Hero Section
  hero: { 
    alignItems: 'center', 
    marginBottom: 24,
    width: '100%',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: { 
    fontSize: 15, 
    textAlign: 'center', 
    lineHeight: 22, 
    paddingHorizontal: 10,
    opacity: 0.8,
  },

  // Cards
  card: { 
    width: '100%', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  // QR Code
  qrWrapper: { 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  qrOverlay: { 
    position: 'absolute', 
    bottom: -8, 
    alignSelf: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 4, 
    borderRadius: 12,
  },
  overlayText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  repoLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  repoLink: { 
    fontSize: 14, 
    fontWeight: '600',
  },

  // Share Grid
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  shareOption: {
    width: '30%',
    alignItems: 'center',
    marginVertical: 4,
  },
  shareIcon: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 6,
  },
  shareLabel: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.7,
  },

  // Features
  features: {
    width: '100%',
    gap: 10,
  },
  featRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
  },
  featText: { 
    fontSize: 14, 
    fontWeight: '500',
  },

  // Share Button
  shareBtn: { 
    width: '100%', 
    height: 60, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '700', 
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  socialCaption: { 
    marginTop: 16, 
    fontSize: 12, 
    fontWeight: '500', 
    opacity: 0.6,
    textAlign: 'center',
  },
});