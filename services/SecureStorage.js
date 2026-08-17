import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS = {
  NOTES: "@vault_notes",
  PASSWORDS: "@vault_passwords",
  EVENTS: "@vault_events",
  PASSKEYS: "@vault_passkeys",
  REMINDERS: "@vault_reminders",
  DRAFT: "@vault_draft",
};

export const SecureStorage = {
  getNotes: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error retrieving notes:", error);
      return [];
    }
  },

  saveNotes: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  },

  getPasswords: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.PASSWORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePasswords: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.PASSWORDS, JSON.stringify(data));
    } catch {}
  },

  getEvents: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveEvents: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(data));
    } catch {}
  },

  getPassKeys: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.PASSKEYS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePassKeys: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.PASSKEYS, JSON.stringify(data));
    } catch {}
  },

  getReminders: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.REMINDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveReminders: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(data));
    } catch {}
  },

  getDraft: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.DRAFT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveDraft: async (data) => {
    try {
      await AsyncStorage.setItem(KEYS.DRAFT, JSON.stringify(data));
    } catch {}
  },

  clearDraft: async () => {
    try {
      await AsyncStorage.removeItem(KEYS.DRAFT);
    } catch {}
  },

  // Full Vault Wipe
  wipeAllVaultData: async () => {
    try {
      const allKeys = Object.values(KEYS);
      await AsyncStorage.multiRemove(allKeys);
    } catch (e) {
      console.error("Failed to wipe vault data", e);
    }
  },

  // Accurate byte calculation without browser Blob dependency
  calculateTotalVaultSize: async () => {
    try {
      const keys = Object.values(KEYS);
      const stores = await AsyncStorage.multiGet(keys);
      let totalBytes = 0;
      stores.forEach(([_, value]) => {
        if (value) {
          totalBytes += value.length;
        }
      });
      return totalBytes;
    } catch {
      return 0;
    }
  },
};