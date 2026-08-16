import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Lock() {
    const { colors } = useContext(ThemeContext);
    const { isLockEnabled, toggleLockEnabled, lockDelay, updateLockDelay } = useContext(AuthContext);

    // Ensure it defaults to 0 (Instantly) if turned on for the first time
    const handleToggle = (value) => {
        toggleLockEnabled(value);
        if (value && lockDelay === undefined) {
            updateLockDelay(0);
        }
    };

    // Formats the hint text based on the selected delay
    const getHintText = () => {
        if (lockDelay === 0) return "The app will lock instantly when put in the background.";
        const timeString = lockDelay < 60 ? `${lockDelay} seconds` : `${Math.floor(lockDelay / 60)} minute${lockDelay === 60 ? '' : 's'}`;
        return `The app will require authentication if inactive for more than ${timeString}.`;
    };

    const DelayOption = ({ seconds, label, isLast }) => {
        const isSelected = lockDelay === seconds;
        return (
            <TouchableOpacity 
                style={[
                    styles.delayRow, 
                    !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.text + '20' }
                ]}
                onPress={() => updateLockDelay(seconds)}
                activeOpacity={0.7}
            >
                <Text style={[styles.delayLabel, { color: isSelected ? colors.primary : colors.text }]}>
                    {label}
                </Text>
                {isSelected && (
                    <Ionicons name="checkmark" size={22} color={colors.primary} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            
            {/* Main Toggle Card */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.row}>
                    <View style={styles.iconText}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="finger-print-outline" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.textStack}>
                            <Text style={[styles.label, { color: colors.text }]}>Biometric Lock</Text>
                            <Text style={[styles.subLabel, { color: colors.textMuted }]}>
                                Secure notes with Face ID / Fingerprint
                            </Text>
                        </View>
                    </View>
                    <Switch 
                        value={isLockEnabled} 
                        onValueChange={handleToggle}
                        trackColor={{ false: '#767577', true: colors.primary + '50' }}
                        thumbColor={isLockEnabled ? colors.primary : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Timeout Settings (Animated/Conditional) */}
            {isLockEnabled && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LOCK TIMEOUT</Text>
                    
                    <View style={[styles.card, styles.listCard, { backgroundColor: colors.card }]}>
                        <DelayOption seconds={0} label="Instantly" />
                        <DelayOption seconds={15} label="15 seconds" />
                        <DelayOption seconds={60} label="1 minute" />
                        <DelayOption seconds={300} label="5 minutes" isLast={true} />
                    </View>
                    
                    <Text style={[styles.hint, { color: colors.textMuted }]}>
                        {getHintText()}
                    </Text>
                </View>
            )}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    card: { 
        padding: 16, 
        borderRadius: 16, 
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    iconText: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1, 
        paddingRight: 10 
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    textStack: {
        flex: 1,
        justifyContent: 'center'
    },
    label: { 
        fontSize: 16, 
        fontWeight: '600',
        marginBottom: 2
    },
    subLabel: {
        fontSize: 12,
        lineHeight: 16
    },
    section: {
        marginTop: 28
    },
    sectionTitle: { 
        fontSize: 12, 
        fontWeight: '700', 
        marginLeft: 12, 
        marginBottom: 8,
        letterSpacing: 0.5
    },
    listCard: {
        padding: 0, // Override padding so rows can touch the edges for borders
    },
    delayRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    delayLabel: { 
        fontSize: 15, 
        fontWeight: '500' 
    },
    hint: { 
        fontSize: 13, 
        lineHeight: 18, 
        marginTop: 12,
        paddingHorizontal: 12
    }
});