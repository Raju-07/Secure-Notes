import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SecureStorage } from '../../services/SecureStorage';
import { Ionicons } from '@expo/vector-icons';

export default function Encryption({navigation}) {
    const { colors } = useContext(ThemeContext);
    const { isBruteForceEnabled, toggleBruteForce } = useContext(AuthContext);
    const [storageUsed, setStorageUsed] = useState(0);

    useEffect(() => {
        const checkStorage = async () => {
            const notes = await SecureStorage.getNotes();
            const stringSize = JSON.stringify(notes).length; // Bytes
            setStorageUsed(stringSize);
        };
        checkStorage();
    }, []);

    const storagePercentage = (storageUsed / 2048000) * 100; // 2MB Limit

    const handleWipeData = () => {
        Alert.alert(
            "Wipe All Data?",
            "This will permanently delete and shred all encrypted notes. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete Everything", 
                    style: "destructive", 
                    onPress: async () => {
                        await SecureStorage.deleteAllNotes();
                        Alert.alert(
                            "Data Wiped Successfully",
                            "All your encrypted notes have been permanently deleted.Data will be refresh shortly",
                            [
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate("Home")
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Tech Info Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>Hardware Encryption</Text>
                <Text style={[styles.infoSubtitle, { color: colors.textMuted }]}>
                    Your notes are encrypted using AES-256-GCM. Decryption keys are stored in your device's Secure Enclave (Keystore/Keychain), inaccessible to other apps.
                </Text>
            </View>

            {/* Storage Monitor */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.label, { color: colors.text }]}>Vault Storage (2MB Limit)</Text>
                <View style={[styles.progressBg, { backgroundColor: colors.background }]}>
                    <View style={[styles.progressBar, { width: `${Math.max(storagePercentage, 2)}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.usageText, { color: colors.textMuted }]}>
                    { (storageUsed / 1024).toFixed(2) } KB used of 2048 KB
                </Text>
            </View>

            {/* Brute Force Toggle */}
            <View style={[styles.row, { backgroundColor: colors.card }]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: colors.text }]}>Brute Force Protection</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>Wipe data after 5 failed attempts</Text>
                </View>
                <Switch 
                    value={isBruteForceEnabled} 
                    onValueChange={toggleBruteForce}
                    trackColor={{ false: '#767577', true: colors.primary + '50' }}
                    thumbColor={isBruteForceEnabled ? colors.primary : '#f4f3f4'}
                />
            </View>

            {/*The Nuclear Option */}
            <TouchableOpacity style={styles.wipeBtn} onPress={handleWipeData}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.wipeText}>Shred All Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    infoCard: { padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 20, elevation: 2 },
    infoTitle: { fontSize: 18, fontWeight: '800', marginTop: 15, marginBottom: 8 },
    infoSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
    section: { padding: 20, borderRadius: 20, marginBottom: 15 },
    row: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 40 },
    label: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
    progressBg: { height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
    progressBar: { height: '100%' },
    usageText: { fontSize: 12, fontWeight: '600' },
    wipeBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 18, 
        borderRadius: 15, 
        borderWidth: 1.5, 
        borderColor: '#EF4444',
        marginBottom: 50 
    },
    wipeText: { color: '#EF4444', fontWeight: '800', marginLeft: 10, fontSize: 16 }
});