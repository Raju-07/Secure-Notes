import React, { createContext, useState, useEffect, useRef } from "react";
import { Alert, AppState } from "react-native"; 
import * as LocalAuthentication from 'expo-local-authentication'; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLocked, setIsLocked] = useState(true);
    const [isLockEnabled, setIsLockedEnabled] = useState(true);
    const [lockDelay, setLockDelay] = useState(0); // Default instant lock
    const [biometricType, setBiometricType] = useState('Biometrics'); // 'Face ID', 'Touch ID', or 'Biometrics'

    const appState = useRef(AppState.currentState);
    const backgroundTime = useRef(null);

    // Session States
    const [isSessionEnabled, setIsSessionEnabled] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(3600);
    const sessionStartTime = useRef(Date.now());

    const resetSessionTimer = () => {
        sessionStartTime.current = Date.now();
    };

    // Detect Biometric Hardware Type
    useEffect(() => {
        const detectBiometrics = async () => {
            try {
                const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                    setBiometricType('Face ID');
                } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                    setBiometricType('Fingerprint / Touch ID');
                } else {
                    setBiometricType('Biometrics');
                }
            } catch {
                setBiometricType('Biometrics');
            }
        };
        detectBiometrics();
    }, []);

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

                resetSessionTimer();
            } catch (e) {
                Alert.alert("Auth Failed", `Failed to load auth settings \n${e}`);
            }
        };
        loadSettings();
    }, []);

    // Session handlers
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

    // App Lock handlers
    const toggleLockEnabled = async () => {
        const newValue = !isLockEnabled;
        setIsLockedEnabled(newValue);
        await AsyncStorage.setItem('isLockEnabled', newValue.toString());
    };

    const updateLockDelay = async (seconds) => { 
        setLockDelay(seconds);
        await AsyncStorage.setItem('lockDelay', seconds.toString());
    };

    // Session Heartbeat
    useEffect(() => {
        let interval;
        if (isSessionEnabled && !isLocked) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - sessionStartTime.current) / 1000;
                if (elapsed >= sessionDuration) {
                    resetSessionTimer();
                    setIsLocked(true);
                    Alert.alert("Session Expired", "Your session limit was reached. Please authenticate to continue.");
                }
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSessionEnabled, sessionDuration, isLocked]);

    // AppState Lifecycle Listener
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/active/) && nextAppState === 'background') {
                backgroundTime.current = Date.now();
            }

            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                if (backgroundTime.current && isLockEnabled) { 
                    const timeAway = (Date.now() - backgroundTime.current) / 1000;
                    if (timeAway >= lockDelay) { 
                        setIsLocked(true);
                    }
                }

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

    const handleUnlock = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                setIsLocked(false);
                resetSessionTimer();
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Secure Notes',
                fallbackLabel: 'Use Device Passcode',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                setIsLocked(false);
                backgroundTime.current = null;
                resetSessionTimer();
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
            biometricType, resetSessionTimer
        }}>
            {children}
        </AuthContext.Provider>
    );
};