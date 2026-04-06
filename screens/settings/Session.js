import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Session() {
    const { colors } = useContext(ThemeContext);
    const { isSessionEnabled, toggleSessionEnabled, sessionDuration, updateSessionDuration } = useContext(AuthContext);

    const timeOptions = [
        { label: '30 Min', value: 1800 },
        { label: '1 Hour', value: 3600 },
        { label: '2 Hours', value: 7200 },
        { label: '4 Hours', value: 14400 },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.infoCard, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="timer-outline" size={28} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                    Session Timeout forces the app to lock after a fixed period of total usage, even if you are actively using it.
                </Text>
            </View>

            <View style={[styles.rowCard, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
                <View style={styles.left}>
                    <Text style={[styles.label, { color: colors.text }]}>Enable Session</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>Auto-lock after total uptime</Text>
                </View>
                <Switch 
                    value={isSessionEnabled} 
                    onValueChange={toggleSessionEnabled}
                    trackColor={{ false: '#767577', true: colors.primary + '50' }}
                    thumbColor={isSessionEnabled ? colors.primary : '#f4f3f4'}
                />
            </View>

            {isSessionEnabled && (
                <View style={styles.optionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SELECT SESSION LENGTH</Text>
                    <View style={styles.grid}>
                        {timeOptions.map((opt) => (
                            <TouchableOpacity 
                                key={opt.value}
                                style={[
                                    styles.timeBtn, 
                                    { backgroundColor: sessionDuration === opt.value ? colors.primary : colors.card }
                                ]}
                                onPress={() => updateSessionDuration(opt.value)}
                            >
                                <Text style={{ 
                                    color: sessionDuration === opt.value ? '#FFF' : colors.text,
                                    fontWeight: '600'
                                }}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <View style={styles.footer}>
                        <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>
                            Next forced lock: After {sessionDuration / 3600} hours of use.
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    infoCard: { padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    infoText: { flex: 1, marginLeft: 15, fontSize: 14, lineHeight: 20 },
    rowCard: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        borderRadius: 20, 
        marginBottom: 30,
        borderWidth: 1,
        elevation: 2 
    },
    label: { fontSize: 16, fontWeight: '700' },
    optionsSection: { flex: 1 },
    sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginLeft: 5, marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    timeBtn: { 
        width: '48%', 
        paddingVertical: 16, 
        borderRadius: 15, 
        alignItems: 'center', 
        marginBottom: 15,
        elevation: 1 
    },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    footerText: { fontSize: 12, marginLeft: 8, fontWeight: '500' }
});