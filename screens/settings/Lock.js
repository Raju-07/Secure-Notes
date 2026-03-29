import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Lock() {
    const { colors } = useContext(ThemeContext);
    const { isLockEnabled, toggleLockEnabled, lockDelay, updateLockDelay } = useContext(AuthContext);

    const DelayOption = ({ seconds, label }) => (
        <TouchableOpacity 
            style={[
                styles.delayBtn, 
                { backgroundColor: lockDelay === seconds ? colors.primary : colors.card }
            ]}
            onPress={() => updateLockDelay(seconds)}
        >
            <Text style={{ color: lockDelay === seconds ? '#FFF' : colors.text }}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <View style={styles.row}>
                    <View style={styles.iconText}>
                        <Ionicons name="finger-print-outline" size={24} color={colors.primary} />
                        <Text style={[styles.label, { color: colors.text }]}>Use Biometric Lock</Text>
                    </View>
                    <Switch 
                        value={isLockEnabled} 
                        onValueChange={toggleLockEnabled}
                        trackColor={{ false: '#767577', true: colors.primary + '50' }}
                        thumbColor={isLockEnabled ? colors.primary : '#f4f3f4'}
                    />
                </View>
            </View>

            {isLockEnabled && (
                <>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LOCK TIMEOUT</Text>
                    <View style={styles.delayContainer}>
                        <DelayOption seconds={0} label="Instantly" />
                        <DelayOption seconds={15} label="15s" />
                        <DelayOption seconds={60} label="1m" />
                        <DelayOption seconds={300} label="5m" />
                    </View>
                    <Text style={[styles.hint, { color: colors.textMuted }]}>
                        The app will require authentication if inactive for more than {lockDelay} seconds.
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { padding: 20, borderRadius: 20, marginBottom: 30, elevation: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconText: { flexDirection: 'row', alignItems: 'center' },
    label: { fontSize: 16, fontWeight: '600', marginLeft: 15 },
    sectionTitle: { fontSize: 13, fontWeight: '700', marginLeft: 10, marginBottom: 15 },
    delayContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    delayBtn: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, minWidth: 80, alignItems: 'center' },
    hint: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 }
});