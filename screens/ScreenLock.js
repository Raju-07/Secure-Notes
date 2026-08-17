import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
const haptic = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

export default function LockScreen() {
  const { colors } = useContext(ThemeContext);
  const { handleUnlock } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  // Auto-prompt for biometric
    useEffect(() => {
    const authenticate = async () => {
        try {
        setIsLoading(true);
        await handleUnlock();
        } catch (error) {
        console.log('Auto-auth failed:', error);
        } finally {
        setIsLoading(false);
        }
    };

    authenticate();
    }, []);


  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const onUnlock = async () => {
    haptic();
    setIsLoading(true);
    await handleUnlock();
    setIsLoading(false);
  };

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Section - Time & Date */}
      <View style={styles.timeSection}>
        <Text style={[styles.time, { color: colors.text }]}>
          {formattedTime}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {formattedDate}
        </Text>
      </View>

      {/* Center Section - Lock Icon & Text */}
      <View style={styles.centerSection}>
        <View style={[styles.iconBox, { backgroundColor: colors.card }]}>
          <Ionicons
            name="lock-closed"
            size={80}
            color={colors.primary}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>App Locked</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Authenticate to access your secure notes.
        </Text>
      </View>

      {/* Bottom Section - Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={onUnlock}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons
            name="lock-open"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>
            {isLoading ? 'Authenticating...' : 'Unlock Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  timeSection: {
    alignItems: 'center',
    paddingTop: 40,
    marginTop: 20,
  },
  time: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 72,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    letterSpacing: -0.3,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 16,
  },
  iconBox: {
    padding: 30,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 12,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
});
