import React, { createContext, useState, useEffect } from "react"; 
import { useColorScheme } from "react-native";  //get system theme 'light' or 'dark'
import AsyncStorage from "@react-native-async-storage/async-storage"; //Store Theme

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => { 
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState('system'); 

    useEffect(() => {
        const loadTheme = async () => {
            console.log(systemTheme,"|| in theme context file")
            try {
                const savedTheme = await AsyncStorage.getItem('userTheme');
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (error) {
                console.log("Error loading theme", error);
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
    background: activeTheme === 'dark' ? '#0F172A' : '#e6eaed',
    card: activeTheme === 'dark' ? '#223450' : '#F1F5F9',
    
    // Typography
    text: activeTheme === 'dark' ? '#F8FAFC' : '#1E293B',
    textMuted: activeTheme === 'dark' ? '#94A3B8' : '#64748B',
    //Add Button 
    button: activeTheme === 'dark' ? '#072e58' : '#F1F5F9',
    icon : activeTheme === 'dark' ? '#F1F5F9' : '#072e58',

    //Modal 
    bottomSheet : activeTheme === 'dark' ? '#1e2b49' : '#e6eaed',
    // Actions & Branding
    primary: activeTheme === 'dark' ? '#818CF8' : '#6366F1',
    success: activeTheme === 'dark' ? '#34D399' : '#10B981',
    borderColor: activeTheme === 'dark' ? '#334155' : '#E2E8F0',
};

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, colors, activeTheme }}>
            {children} 
        </ThemeContext.Provider>
    );
};