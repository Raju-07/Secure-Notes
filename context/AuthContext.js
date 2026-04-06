import React, { createContext, useState, useEffect, useRef } from "react";
import { AppState } from "react-native"; 
import * as LocalAuthentication from 'expo-local-authentication'; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { SecureStorage } from "../services/SecureStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Existing States
    const [isLocked, setIsLocked] = useState(false);
    const [isLockEnabled, setIsLockedEnabled] = useState(true);
    const [lockDelay, setLockDelay] = useState(10);
    const appState = useRef(AppState.currentState);
    const backgroundTime = useRef(null);

    // --- NEW SESSION STATES ---
    const [isSessionEnabled, setIsSessionEnabled] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(3600); // Default 1 hour
    const sessionStartTime = useRef(Date.now()); // Mark launch time

    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isBruteForceEnabled, setIsBruteForceEnabled] = useState(false);
    // Loading saved settings
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Existing
                const enabled = await AsyncStorage.getItem('isLockEnabled'); 
                const delay = await AsyncStorage.getItem('lockDelay');
                if (enabled !== null) setIsLockedEnabled(enabled === 'true');
                if (delay !== null) setLockDelay(parseInt(delay));

                // Session Settings
                const sEnabled = await AsyncStorage.getItem('isSessionEnabled');
                const sDuration = await AsyncStorage.getItem('sessionDuration');
                if (sEnabled !== null) setIsSessionEnabled(sEnabled === 'true');
                if (sDuration !== null) setSessionDuration(parseInt(sDuration));

                const bfEnabled = await AsyncStorage.getItem('isBruteForceEnabled');
                if (bfEnabled !== null) setIsBruteForceEnabled(bfEnabled === 'true');

            } catch (e) {
                console.error("Failed to load auth settings", e);
            }
        };
        loadSettings();
    }, []);

    // --- NEW SESSION FUNCTIONS ---
    const toggleSessionEnabled = async () => {
        const newValue = !isSessionEnabled;
        setIsSessionEnabled(newValue);
        await AsyncStorage.setItem('isSessionEnabled', newValue.toString());
    };

    const updateSessionDuration = async (seconds) => { 
        setSessionDuration(seconds);
        await AsyncStorage.setItem('sessionDuration', seconds.toString());
    };

    // Existing Lock Functions
    const toggleLockEnabled = async () => {
        const newValue = !isLockEnabled;
        setIsLockedEnabled(newValue);
        await AsyncStorage.setItem('isLockEnabled', newValue.toString());
    };

    const updateLockDelay = async (seconds) => { 
        setLockDelay(seconds);
        await AsyncStorage.setItem('lockDelay', seconds.toString());
    };

    // --- SESSION HEARTBEAT ---
    useEffect(() => {
        let interval;
        if (isSessionEnabled) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - sessionStartTime.current) / 1000;
                if (elapsed >= sessionDuration) {
                    setIsLocked(true);
                    console.log("Session Timeout Reached.");
                }
            }, 30000); // Check every 30 seconds
        }
        return () => clearInterval(interval);
    }, [isSessionEnabled, sessionDuration]);

    // AppState Listener
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/active/) && nextAppState === 'background') {
                backgroundTime.current = Date.now();
            }

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
    }, [isLockEnabled, lockDelay]);

    const toggleBruteForce = async () => {
        const newValue = !isBruteForceEnabled;
        await AsyncStorage.setItem('isBruteForceEnabled',newValue.toString());
    };

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
                // Important: We DON'T reset sessionStartTime here. 
                // A session lasts across unlocks until the app is fully closed.
                setFailedAttempts(0);
            } else {
                const newFailCount = failedAttempts + 1;
                setFailedAttempts(newFailCount);

                if (isBruteForceEnabled && newFailCount >= 5) {
                    await SecureStorage.deleteAllNotes();
                    alert("Security Protocol: Data wiped due to too many failed attempts");
                }
            }
        } catch (error) {
            console.error("Auth error", error);
        };
    };

    return (
        <AuthContext.Provider value={{ 
            isLocked, setIsLocked, handleUnlock, 
            isLockEnabled, toggleLockEnabled, lockDelay, updateLockDelay,
            isSessionEnabled, toggleSessionEnabled, sessionDuration, updateSessionDuration
        }}>
            {children}
        </AuthContext.Provider>
    );
};