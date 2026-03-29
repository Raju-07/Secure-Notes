import React, { useContext, version } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  
  // Reusable Setting Row Component
  const SettingItem = ({ icon, title, onPress, color = "#475569" }) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.title,{color:colors.text}]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container,{backgroundColor:colors.background}]}>
      <SafeAreaView>
      <Text style={[styles.headerText,{color:colors.text}]}>Settings</Text>

      <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
        <SettingItem
            icon="lock-closed-outline"
            title="Lock App"
            color='#10B981'
            onPress={()=> navigation.navigate("Lock")}
            />
      </View>
      <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
        <SettingItem
            icon="color-palette-outline"
            title="Theme"
            color='#ff00aa'
            onPress={()=> navigation.navigate("Theme")}
            />
      </View>
      
      <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
        <SettingItem
            icon="timer-outline"
            title="Session"
            color='#F59E0B'
            onPress={()=> navigation.navigate("Session")}
            />
      </View>

        <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
        <SettingItem 
            icon="shield-outline" 
            title="Encryption" 
            color="#6366F1"
            onPress={() => navigation.navigate("Encryption")} 
            />
        </View>

      <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
        <SettingItem 
          icon="information-circle-outline" 
          title="About Us" 
          color="#3B82F6"
          onPress={() => navigation.navigate("About")} 
        />
        </View>

        <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
            <SettingItem 
            icon="chatbubble-ellipses-outline" 
            title="Feedback" 
            color="#06B6D4"
            onPress={() => navigation.navigate("Feedback")} 
            />
        </View>

        <View style={[styles.section,{backgroundColor:colors.card,borderColor:colors.borderColor}]}>
        <SettingItem 
          icon="share-social-outline" 
          title="Share App" 
          color="#8B5CF6"
          onPress={() => navigation.navigate("Share")} 
        />
      </View>

      <View style={styles.version}>
          <Text style={[styles.text,{color:colors.text}]}> Version: {Constants.expoConfig.version} </Text>
      </View>

    </SafeAreaView>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#1E293B',
  },
  section: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius:10,
    marginLeft:12,
    marginRight:12,
    marginBottom:3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,

    borderBottomColor: '#0e0e0f',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  version:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:10,
  },
  text:{
    fontSize:12,
    fontWeight:500,
  }
});