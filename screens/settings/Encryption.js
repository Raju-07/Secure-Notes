import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SecureStorage } from '../../services/SecureStorage';

const haptic = (type = Haptics.ImpactFeedbackStyle.Medium) => {
  if (Platform.OS === 'ios') Haptics.impactAsync(type);
};

export default function EncryptionScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { isBruteForceEnabled, toggleBruteForce, failedAttempts } = useContext(AuthContext);

  const [storageUsed, setStorageUsed] = useState(0);
  const [isWipeModalVisible, setIsWipeModalVisible] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  const MAX_STORAGE_BYTES = 2 * 1024 * 1024; // 2MB Limit

  const refreshStorage = async () => {
    const totalBytes = await SecureStorage.calculateTotalVaultSize();
    setStorageUsed(totalBytes);
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  const storagePercentage = Math.min((storageUsed / MAX_STORAGE_BYTES) * 100, 100);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleConfirmWipe = async () => {
    setIsWiping(true);
    haptic(Haptics.ImpactFeedbackStyle.Heavy);
    await SecureStorage.wipeAllVaultData();
    setIsWiping(false);
    setIsWipeModalVisible(false);
    await refreshStorage();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Tech Overview Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
        <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Hardware-Backed Encryption</Text>
        <Text style={[styles.infoSubtitle, { color: colors.textMuted }]}>
          Your vault items are protected with AES-256 encryption. Cryptographic keys reside in your device's Secure Enclave / KeyStore.
        </Text>
      </View>

      {/* Real-time Storage Monitor Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Vault Storage Capacity</Text>
          <Text style={[styles.percentageBadge, { color: colors.primary, backgroundColor: colors.primary + '15' }]}>
            {storagePercentage.toFixed(1)}%
          </Text>
        </View>

        {/* Dynamic Progress Bar */}
        <View style={[styles.progressBg, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.max(storagePercentage, 2)}%`,
                backgroundColor: storagePercentage > 85 ? '#FF6584' : colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.storageDetailsRow}>
          <Text style={[styles.storageDetailsText, { color: colors.textMuted }]}>
            {formatSize(storageUsed)} used
          </Text>
          <Text style={[styles.storageDetailsText, { color: colors.textMuted }]}>
            2.00 MB limit
          </Text>
        </View>
      </View>

      {/* Brute Force Protection Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Brute-Force Protection (Future Update)</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
              Automatically wipe all records if 5 consecutive failed unlock attempts occur.
            </Text>
          </View>
          <Switch
            value={isBruteForceEnabled}
            onValueChange={toggleBruteForce}
            trackColor={{ false: '#767577', true: colors.primary }}
          />
        </View>

        {isBruteForceEnabled && (
          <View style={[styles.failedAttemptsBanner, { backgroundColor: colors.background }]}>
            <Ionicons
              name={failedAttempts > 0 ? 'warning-outline' : 'shield-outline'}
              size={18}
              color={failedAttempts > 0 ? '#FF6584' : colors.primary}
            />
            <Text style={[styles.failedAttemptsText, { color: colors.text }]}>
              Failed attempts: <Text style={{ fontWeight: '700' }}>{failedAttempts} / 5</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Danger Zone: Shred All Vault Data */}
      <TouchableOpacity
        style={[styles.wipeBtn, { borderColor: '#EF4444' }]}
        onPress={() => {
          haptic(Haptics.ImpactFeedbackStyle.Heavy);
          setIsWipeModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
        <Text style={styles.wipeText}>Shred All Vault Data</Text>
      </TouchableOpacity>

      {/* Custom Destructive Confirmation Modal */}
      <Modal visible={isWipeModalVisible} transparent animationType="fade" onRequestClose={() => setIsWipeModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
            <View style={styles.modalIconBg}>
              <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>Permanently Erase Vault?</Text>
            <Text style={[styles.modalDescription, { color: colors.textMuted }]}>
              This will irreversibly delete and overwrite all encrypted notes, passwords, passkeys, reminders, and draft files stored on this device.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { backgroundColor: colors.background }]}
                onPress={() => setIsWipeModalVisible(false)}
                disabled={isWiping}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalDeleteBtn, { backgroundColor: '#EF4444' }]}
                onPress={handleConfirmWipe}
                disabled={isWiping}
              >
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>
                  {isWiping ? 'Shredding...' : 'Erase Everything'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  iconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  percentageBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  storageDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storageDetailsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  failedAttemptsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  failedAttemptsText: {
    fontSize: 12,
  },
  wipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 10,
    marginBottom: 40,
  },
  wipeText: {
    color: '#EF4444',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF444415',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});