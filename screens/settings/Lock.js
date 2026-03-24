import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function Lock() {
    const [isLocked, setIsLocked] = useState(false);

    const toggleLock = () => {
        setIsLocked(!isLocked);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lock Settings</Text>
            <View style={styles.lockOption}>
                <Text style={styles.label}>Enable Lock</Text>
                <Switch value={isLocked} onValueChange={toggleLock} />
            </View>
            <Text style={styles.status}>
                {isLocked ? 'Lock is enabled' : 'Lock is disabled'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    lockOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
    },
    status: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
});