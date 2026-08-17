import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

export default function AboutScreen() {
  const { colors, activeTheme } = useContext(ThemeContext);

  const developers = [
    {
      name: 'Raju Yadav',
      role: 'App Developer',
      github: 'https://github.com/raju-07',
      color: '#F59E0B',
    },
    {
      name: 'Raja Singh Rajput',
      role: 'UX Designer',
      github: 'https://github.com/rajasinghrajpoot',
      color: colors.text,
    },
    {
      name: 'Prachi Jaswal',
      role: 'UI/UX Designer',
      github: 'https://github.com/prachi-jaswal',
      color: '#10B981',
    },
  ];

  const features = [
    { 
      icon: 'shield-checkmark', 
      label: 'HW Encryption', 
      subtext: 'Expo Secure Store',
      color: '#6366F1' 
    },
    { 
      icon: 'time', 
      label: 'Session Protection', 
      subtext: 'Auto-lock & Timeouts',
      color: '#F59E0B' 
    },
    { 
      icon: 'finger-print', 
      label: 'Biometric Security', 
      subtext: 'Face ID • Touch ID',
      color: '#8B5CF6' 
    },
    { 
      icon: 'cloud-offline', 
      label: 'No Cloud', 
      subtext: '100% Local Storage',
      color: '#EF4444' 
    },
    { 
      icon: 'flash', 
      label: 'Fast', 
      subtext: 'Lightning Performance',
      color: '#10B981' 
    },
    { 
      icon: 'color-palette', 
      label: 'Theme', 
      subtext: 'Dark • Light • Custom',
      color: '#EC4899' 
    },
    { 
      icon: 'folder-open', 
      label: 'Organized', 
      subtext: 'Smart Categories',
      color: '#3B82F6' 
    },
  ];

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={[styles.logoContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>Secure Notes</Text>
        <Text style={styles.tagline}>Safe • Private • Powerful</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v2.0.1</Text>
        </View>
      </View>

      {/* About Card */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>About</Text>
        </View>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Secure Notes is a privacy-first note-taking app that combines powerful 
          features with robust security. Keep your thoughts, passwords, and 
          important information safe with end-to-end encryption.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="star" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Features</Text>
        </View>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                <Ionicons name={feature.icon} size={20} color={feature.color} />
              </View>
              <Text style={[styles.featureLabel, { color: colors.text }]}>
                {feature.label}
              </Text>
              <Text style={[styles.featureSubtext, { color: colors.textMuted }]}>
                {feature.subtext}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Developers Section */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="people" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Team</Text>
        </View>
        
        {developers.map((dev, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(dev.github)}
            style={[
              styles.devCard,
              { 
                backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderColor: colors.borderColor,
              }
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.devInfo}>
              <View style={[styles.devAvatar, { backgroundColor: dev.color + '20' }]}>
                <Text style={[styles.devInitial, { color: dev.color }]}>
                  {dev.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.devDetails}>
                <Text style={[styles.devName, { color: colors.text }]}>{dev.name}</Text>
                <Text style={[styles.devRole, { color: colors.textMuted }]}>{dev.role}</Text>
              </View>
            </View>
            <Ionicons name="logo-github" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Made with ❤️ by the Secure Notes Team
        </Text>
        <Text style={[styles.footerSubtext, { color: colors.textMuted }]}>
          © 2024 All Rights Reserved
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  // Hero Section
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoContainer: {
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  versionBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Cards
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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

  // About Description
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '31%',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureIcon: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  featureSubtext: {
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 2,
  },

  // Developers
  devCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  devInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  devAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  devInitial: {
    fontSize: 16,
    fontWeight: '700',
  },
  devDetails: {
    gap: 2,
  },
  devName: {
    fontSize: 15,
    fontWeight: '600',
  },
  devRole: {
    fontSize: 12,
    opacity: 0.7,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  footerSubtext: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
});