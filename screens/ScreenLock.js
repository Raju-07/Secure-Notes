import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function LockScreen() {
    const { colors } = useContext(ThemeContext);
    const { handleUnlock } = useContext(AuthContext);

    // Automatically prompt for fingerprint as soon as this screen appears
    useEffect(() => {
        handleUnlock();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.card }]}>
                <Ionicons name="lock-closed" size={80} color={colors.primary} />
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>App Locked</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Authenticate to access your secure notes.
            </Text>

            <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleUnlock}
            >
                <Text style={styles.buttonText}>Unlock Now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    iconBox: { padding: 30, borderRadius: 100, marginBottom: 20, elevation: 5 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40 },
    button: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});