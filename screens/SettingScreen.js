import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  
  // Reusable Setting Row Component
  const SettingItem = ({ icon, title, onPress, color = "#475569" }) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

      <View style={styles.section}>
        <SettingItem
            icon="lock-closed-outline"
            title="Lock App"
            color='#10B981'
            onPress={()=> console.log("Navigate to Lock Application Page")}
            />
      </View>
      
      <View style={styles.section}>
        <SettingItem
            icon="color-palette-outline"
            title="Session"
            color='#F59E0B'
            onPress={()=> console.log("Navigate to Session Page")}
            />
      </View>

        <SettingItem 
            icon="shield-outline" 
            title="Encryption" 
            color="#6366F1"
            onPress={() => console.log("Welcome to Encryption")} 
          />

      <View style={styles.section}>
        <SettingItem 
          icon="information-circle-outline" 
          title="About Us" 
          color="#3B82F6"
          onPress={() => console.log("Navigate to About Page")} 
        />
        
        <SettingItem 
          icon="chatbubble-ellipses-outline" 
          title="Feedback" 
          color="#06B6D4"
          onPress={() => console.log("Navigate to Feedback Page")} 
        />

        <SettingItem 
          icon="share-social-outline" 
          title="Share App" 
          color="#8B5CF6"
          onPress={() => console.log("Open Share Dialog")} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#1E293B',
  },
  section: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
});