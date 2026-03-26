import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingScreen';
import Lock from '../screens/settings/Lock';
import SessionScreen from '../screens/settings/Session';
import EncryptionScreen from '../screens/settings/Encryption';
import ShareScreen from '../screens/settings/ShareApp';
import AboutScreen from '../screens/settings/AboutScreen';
import FeedbackScreen from '../screens/settings/Feedback';
import AppTheme from '../screens/settings/Theme';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStack(){
  return (
    //Main Settings Tab
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component = {SettingsScreen}
        options ={{headerShown:false}}
      />
  {/* Lock Screen Page */}
      <Stack.Screen
        name="Lock"
        component = {Lock}
        options ={{title:"Application Lock" }}
      />
      {/* Theme screen Page */}
      <Stack.Screen
        name="Theme"
        component = {AppTheme}
        options ={{title:"Theme" }}
      />

      {/* // Session Screen Page */}
      <Stack.Screen
        name="Session"
        component = {SessionScreen}
        options ={{title:"Session" }}
      />

      {/* // Encryption Screen Page */}
      <Stack.Screen
        name="Encryption"
        component = {EncryptionScreen}
        options ={{title:"Encryption" }}
      />

      {/* // Feedback Screen Page */}
      <Stack.Screen
        name="Feedback"
        component = {FeedbackScreen}
        options ={{title:"Feedback" }}
      />

      <Stack.Screen
        name="About"
        component = {AboutScreen}
        options ={{title:"About Secure Notes" }}
      />
      {/* //Share Screen Page */}
      <Stack.Screen
        name="Share"
        component = {ShareScreen}
        options ={{title:"Share" }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex:1,justifyContent:'center'}}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,           
            tabBarActiveTintColor: '#000000e5', 
            tabBarInactiveTintColor: 'gray',   
            tabBarStyle: { height: 60 },     
            
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>


      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
  },
});