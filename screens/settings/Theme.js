import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";

export default function AppTheme() {
    const { theme, updateTheme, colors } = useContext(ThemeContext);

    // Reusable row component matching the Lock screen's DelayOption
    const ThemeOption = ({ value, label, iconName, isLast }) => {
        const isSelected = theme === value;
        
        return (
            <TouchableOpacity
                style={[
                    styles.themeRow,
                    !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.text + '20' }
                ]}
                onPress={() => updateTheme(value)}
                activeOpacity={0.7}
            >
                <View style={styles.iconText}>
                    <View style={[
                        styles.iconContainer, 
                        { backgroundColor: isSelected ? colors.primary + '15' : colors.text + '08' }
                    ]}>
                        <Ionicons 
                            name={iconName} 
                            size={20} 
                            color={isSelected ? colors.primary : colors.text} 
                        />
                    </View>
                    <Text style={[styles.themeLabel, { color: isSelected ? colors.primary : colors.text }]}>
                        {label}
                    </Text>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark" size={22} color={colors.primary} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
                
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <ThemeOption 
                        value="system" 
                        label="System Default" 
                        iconName="cog-outline" 
                    />
                    <ThemeOption 
                        value="light" 
                        label="Light Theme" 
                        iconName="sunny-outline" 
                    />
                    <ThemeOption 
                        value="dark" 
                        label="Dark Theme" 
                        iconName="moon-outline" 
                        isLast={true} 
                    />
                </View>

                <Text style={[styles.hint, { color: colors.textMuted }]}>
                    System default will automatically match your device's active theme.
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    section: {
        marginTop: 10
    },
    sectionTitle: { 
        fontSize: 12, 
        fontWeight: '700', 
        marginLeft: 12, 
        marginBottom: 8,
        letterSpacing: 0.5
    },
    card: { 
        borderRadius: 16, 
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        overflow: 'hidden' // Keeps the inner borders clean
    },
    themeRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    iconText: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    themeLabel: { 
        fontSize: 16, 
        fontWeight: '500' 
    },
    hint: { 
        fontSize: 13, 
        lineHeight: 18, 
        marginTop: 12,
        paddingHorizontal: 12
    }
});