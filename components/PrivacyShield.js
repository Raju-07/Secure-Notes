import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ScreenCapture from 'expo-screen-capture';
import { ThemeContext } from '../context/ThemeContext';

export default function PrivacyShield({ children }) {
  const { colors, activeTheme } = useContext(ThemeContext);
  const [isLocked, setIsLocked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 1. Android Native Protection (prevents recents snapshots & screenshots)
  useEffect(() => {
    if (Platform.OS === 'android') {
      ScreenCapture.preventScreenCaptureAsync();
    }
    return () => {
      if (Platform.OS === 'android') {
        ScreenCapture.allowScreenCaptureAsync();
      }
    };
  }, []);

  // 2. Cross-platform AppState listener
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setIsLocked(true);

        if (Platform.OS === 'android') {
          // Instant change on Android to match background thread timing
          fadeAnim.setValue(1);
        } else {
          // Smooth blur transition on iOS
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      } else if (nextAppState === 'active') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setIsLocked(false);
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {children}

      <Animated.View
        style={[
          styles.shield,
          {
            opacity: fadeAnim,
            elevation: isLocked ? 99999 : 0,
          },
        ]}
        pointerEvents={isLocked ? 'auto' : 'none'}
      >
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={90}
            tint={activeTheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.background || colors.card },
            ]}
          />
        )}

        <View style={styles.shieldContent}>
          <View
            style={[
              styles.iconBg,
              { backgroundColor: colors.primary ? colors.primary + '20' : '#6366F120' },
            ]}
          >
            <Ionicons name="lock-closed" size={40} color={colors.primary || '#6366F1'} />
          </View>
          <Text style={[styles.shieldTitle, { color: colors.text }]}>
            Secure Vault
          </Text>
          <Text style={[styles.shieldSubtitle, { color: colors.textMuted }]}>
            Content hidden for your privacy
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shield: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  shieldTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  shieldSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});