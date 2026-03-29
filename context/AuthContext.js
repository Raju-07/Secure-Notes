import React, { createContext, useState, useEffect, useRef } from "react";
import { AppState } from "react-native"; // for detecting app current state - locked open or minimized
import * as LocalAuthentication from 'expo-local-authentication'; // for local authentication
import AsyncStorage from "@react-native-async-storage/async-storage"; // for storing app close time and other info

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLocked, setIsLocked] = useState(false);
    const [isLockEnabled, setIsLockedEnabled] = useState(true);
    const [lockDelay, setLockDelay] = useState(10);
    const appState = useRef(AppState.currentState);
    const backgroundTime = useRef(null);

    // Loding saved settings 
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const enabled = await AsyncStorage.getItem('isLockEnabled'); 
                const delay = await AsyncStorage.getItem('lockDelay');
                if (enabled !== null) setIsLockedEnabled(enabled === 'true');
                if (delay !== null) setLockDelay(parseInt(delay));
            } catch (e) {
                console.error("Failed to load auth settings", e);
            }
        };
        loadSettings();
    }, []);

    
    const toggleLockEnabled = async () => {
        const newValue = !isLockEnabled;
        setIsLockedEnabled(newValue);
        await AsyncStorage.setItem('isLockEnabled', newValue.toString());
    };

    const updateLockDelay = async (seconds) => { 
        setLockDelay(seconds);
        await AsyncStorage.setItem('lockDelay', seconds.toString());
    };

    //AppState Listener
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            // App going to background
            if (appState.current.match(/active/) && nextAppState === 'background') {
                backgroundTime.current = Date.now();
            }

            // App opened again
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                if (backgroundTime.current && isLockEnabled) { 
                    const timeAway = (Date.now() - backgroundTime.current) / 1000;
                    
                    if (timeAway > lockDelay) { 
                        setIsLocked(true);
                    }
                }
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [isLockEnabled, lockDelay]); // Add dependencies so listener knows when settings change

    const handleUnlock = async () => {
        try {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                setIsLocked(false);
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Secure Notes',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            if (result.success) {
                setIsLocked(false);
                backgroundTime.current = null;
            }
        } catch (error) {
            console.error("Auth error", error);
        };
    };

    return (
        <AuthContext.Provider value={{ isLocked, setIsLocked, handleUnlock, isLockEnabled, toggleLockEnabled, lockDelay, updateLockDelay }}>
            {children}
        </AuthContext.Provider>
    );
};