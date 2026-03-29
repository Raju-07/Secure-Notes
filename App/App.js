import { StatusBar } from 'expo-status-bar';
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
import { ThemeContext, ThemeProvider } from '../context/ThemeContext';  // imported Theme Provider
import { useContext } from 'react';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStack(){
    const {colors} = useContext(ThemeContext);
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
        }}>
            <Stack.Screen name="Setting" component={SettingsScreen} options={{headerShown:false}} />
            <Stack.Screen name="Lock" component={Lock} options={{title:"Application Lock"}} />
            <Stack.Screen name="Theme" component={AppTheme} options={{title:"Theme"}} />
            <Stack.Screen name="Session" component={SessionScreen} options={{title:"Session"}} />
            <Stack.Screen name="Encryption" component={EncryptionScreen} options={{title:"Encryption"}} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} options={{title:"Feedback"}} />
            <Stack.Screen name="About" component={AboutScreen} options={{title:"About Us"}} />
            <Stack.Screen name="Share" component={ShareScreen} options={{title:"Share"}} />
        </Stack.Navigator>
    );
}

function MainApp() {
  const { activeTheme,colors } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'}/>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,           
              tabBarActiveTintColor: colors.primary, 
              tabBarInactiveTintColor: 'gray',   
              tabBarStyle: { 
                height: 65, 
                backgroundColor: colors.card, 
                borderTopColor: colors.background,
                paddingBottom: 10
              },     
              
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = route.name === 'Home' 
                  ? (focused ? 'home' : 'home-outline') 
                  : (focused ? 'settings' : 'settings-outline');
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

export default function App() {
  return (
    <ThemeProvider>
       <MainApp />
    </ThemeProvider>
  );
}