import React, { createContext, useState, useEffect, useRef } from "react";
import { Alert, AppState } from "react-native"; 
import * as LocalAuthentication from 'expo-local-authentication'; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { SecureStorage } from "../services/SecureStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLocked, setIsLocked] = useState(true);
    const [isLockEnabled, setIsLockedEnabled] = useState(true);
    const [lockDelay, setLockDelay] = useState(10);
    const appState = useRef(AppState.currentState);
    const backgroundTime = useRef(null);

    // Session States
    const [isSessionEnabled, setIsSessionEnabled] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(3600);
    const sessionStartTime = useRef(Date.now());

    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isBruteForceEnabled, setIsBruteForceEnabled] = useState(false);

    // Reset session timer helper
    const resetSessionTimer = () => {
        sessionStartTime.current = Date.now();
    };

    // Load saved settings
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const enabled = await AsyncStorage.getItem('isLockEnabled'); 
                const delay = await AsyncStorage.getItem('lockDelay');
                if (enabled !== null) setIsLockedEnabled(enabled === 'true');
                if (delay !== null) setLockDelay(parseInt(delay, 10));

                const sEnabled = await AsyncStorage.getItem('isSessionEnabled');
                const sDuration = await AsyncStorage.getItem('sessionDuration');
                if (sEnabled !== null) setIsSessionEnabled(sEnabled === 'true');
                if (sDuration !== null) setSessionDuration(parseInt(sDuration, 10));

                const bfEnabled = await AsyncStorage.getItem('isBruteForceEnabled');
                if (bfEnabled !== null) setIsBruteForceEnabled(bfEnabled === 'true');

                resetSessionTimer();
            } catch (e) {
                Alert.alert("Auth Failed", `Failed to load auth settings \n${e}`);
            }
        };
        loadSettings();
    }, []);

    // Session toggles & updates
    const toggleSessionEnabled = async () => {
        const newValue = !isSessionEnabled;
        setIsSessionEnabled(newValue);
        resetSessionTimer();
        await AsyncStorage.setItem('isSessionEnabled', newValue.toString());
    };

    const updateSessionDuration = async (seconds) => { 
        setSessionDuration(seconds);
        resetSessionTimer();
        await AsyncStorage.setItem('sessionDuration', seconds.toString());
    };

    const toggleLockEnabled = async () => {
        const newValue = !isLockEnabled;
        setIsLockedEnabled(newValue);
        await AsyncStorage.setItem('isLockEnabled', newValue.toString());
    };

    const updateLockDelay = async (seconds) => { 
        setLockDelay(seconds);
        await AsyncStorage.setItem('lockDelay', seconds.toString());
    };

    // Session Heartbeat Check
    useEffect(() => {
        let interval;
        if (isSessionEnabled && !isLocked) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - sessionStartTime.current) / 1000;
                if (elapsed >= sessionDuration) {
                    resetSessionTimer(); // Reset baseline so it doesn't re-trigger immediately
                    setIsLocked(true);
                    Alert.alert("Session Expired", "Your session limit was reached. Please authenticate to continue.");
                }
            }, 5000); // Check every 5 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSessionEnabled, sessionDuration, isLocked]);

    // AppState Listener (Handles backgrounding & session expiry when reopening)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/active/) && nextAppState === 'background') {
                backgroundTime.current = Date.now();
            }

            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // 1. Inactivity background delay check
                if (backgroundTime.current && isLockEnabled) { 
                    const timeAway = (Date.now() - backgroundTime.current) / 1000;
                    if (timeAway > lockDelay) { 
                        setIsLocked(true);
                    }
                }

                // 2. Check if session expired while backgrounded
                if (isSessionEnabled && !isLocked) {
                    const elapsed = (Date.now() - sessionStartTime.current) / 1000;
                    if (elapsed >= sessionDuration) {
                        resetSessionTimer();
                        setIsLocked(true);
                    }
                }
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [isLockEnabled, lockDelay, isSessionEnabled, sessionDuration, isLocked]);

    const toggleBruteForce = async () => {
        const newValue = !isBruteForceEnabled;
        setIsBruteForceEnabled(newValue);
        await AsyncStorage.setItem('isBruteForceEnabled', newValue.toString());
    };

    const handleUnlock = async () => {
        try {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                setIsLocked(false);
                resetSessionTimer();
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
                setFailedAttempts(0);
                resetSessionTimer(); // Starts a fresh session upon unlock
            } else {
                const newFailCount = failedAttempts + 1;
                setFailedAttempts(newFailCount);

                if (isBruteForceEnabled && newFailCount >= 5) {
                    await SecureStorage.deleteAllNotes();
                    Alert.alert("Security Protocol", "Data wiped due to too many failed attempts.");
                }
            }
        } catch (error) {
            Alert.alert("Auth Error", `Authentication Failed: \n${error}`);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isLocked, setIsLocked, handleUnlock, 
            isLockEnabled, toggleLockEnabled, lockDelay, updateLockDelay,
            isSessionEnabled, toggleSessionEnabled, sessionDuration, updateSessionDuration,
            isBruteForceEnabled, toggleBruteForce, resetSessionTimer
        }}>
            {children}
        </AuthContext.Provider>
    );
};