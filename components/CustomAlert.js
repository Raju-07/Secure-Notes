import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const CustomAlert = ({
  visible,
  title,
  message,
  type = 'info', // 'info', 'warning', 'danger'
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  theme = 'light', // 'light' or 'dark'
  hapticFeedback = true,
}) => {
  // Haptic feedback on show
  React.useEffect(() => {
    if (visible && hapticFeedback && Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [visible, hapticFeedback]);

  const getIconConfig = () => {
    switch (type) {
      case 'danger':
        return { name: 'trash', color: '#FF6584' };
      case 'warning':
        return { name: 'warning', color: '#F7971E' };
      default:
        return { name: 'information-circle', color: '#6366F1' };
    }
  };

  const iconConfig = getIconConfig();
  const isDark = theme === 'dark';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.alertBackdrop}>
        {/* Backdrop overlay */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: isDark
                ? 'rgba(0,0,0,0.75)'
                : 'rgba(0,0,0,0.3)',
            },
          ]}
        />

        <View style={styles.alertWrapper}>
          <View
            style={[
              styles.alertCard,
              {
                backgroundColor: isDark
                  ? 'rgba(30,30,30,0.95)'
                  : 'rgba(255,255,255,0.95)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.5)',
                overflow: 'hidden',
              },
            ]}
          >
            {/* iOS Blur Effect */}
            {Platform.OS === 'ios' && (
              <BlurView
                intensity={isDark ? 60 : 30}
                tint={isDark ? 'dark' : 'light'}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 28 }]}
              />
            )}

            {/* Content container */}
            <View style={styles.alertContent}>
              <View
                style={[
                  styles.alertIconBg,
                  {
                    backgroundColor:
                      type === 'danger'
                        ? '#FF658415'
                        : type === 'warning'
                        ? '#F7971E15'
                        : '#6366F115',
                  },
                ]}
              >
                <Ionicons name={iconConfig.name} size={32} color={iconConfig.color} />
              </View>

              <Text
                style={[
                  styles.alertTitle,
                  { color: isDark ? '#FFFFFF' : '#1A1A1A' },
                ]}
              >
                {title}
              </Text>

              <Text
                style={[
                  styles.alertMessage,
                  { color: isDark ? '#CCCCCC' : '#666666' },
                ]}
              >
                {message}
              </Text>

              <View style={styles.alertButtonGroup}>
                {showCancel && (
                  <Pressable
                    onPress={onCancel}
                    style={({ pressed }) => [
                      styles.alertBtn,
                      styles.alertBtnCancel,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.05)',
                        borderColor: isDark
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.08)',
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.alertBtnText,
                        { color: isDark ? '#CCCCCC' : '#666666' },
                      ]}
                    >
                      {cancelText}
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={onConfirm}
                  style={({ pressed }) => [
                    styles.alertBtn,
                    styles.alertBtnConfirm,
                    {
                      backgroundColor:
                        type === 'danger' ? '#FF6584' : '#6366F1',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.alertBtnText, { color: '#FFFFFF' }]}>
                    {confirmText}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  alertContent: {
    padding: 28,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  alertIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    zIndex: 2,
    letterSpacing: -0.3,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  alertButtonGroup: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    zIndex: 2,
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
});

export default CustomAlert;