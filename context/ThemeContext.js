import React, { createContext, useState, useEffect } from "react"; 
import { Alert, useColorScheme } from "react-native";  //get system theme 'light' or 'dark'
import AsyncStorage from "@react-native-async-storage/async-storage"; //Store Theme

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => { 
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState('system'); 

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('userTheme');
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (error) {
                Alert.alert("Loading Failed",`Error while loading theme \n${error}`);
            }
        };
        loadTheme(); 
    }, []);

    // Function for updating the Theme
    const updateTheme = async (newTheme) => {
        setTheme(newTheme);
        await AsyncStorage.setItem('userTheme', newTheme);
    };

    const activeTheme = theme === 'system' ? systemTheme : theme;

    const colors = {
    // Layout
    background: activeTheme === 'dark' ? '#0F172A' : '#F1F5F9', 
    card: activeTheme === 'dark' ? '#1E293B' : '#FFFFFF',       
    
    // Typography
    text: activeTheme === 'dark' ? '#F8FAFC' : '#1E293B',       
    textMuted: activeTheme === 'dark' ? '#94A3B8' : '#64748B',  
    
    // Buttons & Icons
    button: activeTheme === 'dark' ? '#334155' : '#1E293B',     
    icon: activeTheme === 'dark' ? '#F8FAFC' : '#000000',  

    bottomSheet: activeTheme === 'dark' ? '#1E293B' : '#FFFFFF',

    primary: activeTheme === 'dark' ? '#818CF8' : '#4F46E5',    
    success: activeTheme === 'dark' ? '#34D399' : '#10B981',    
    borderColor: activeTheme === 'dark' ? '#334155' : '#E2E8F0', 
};

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, colors, activeTheme }}>
            {children} 
        </ThemeContext.Provider>
    );
};