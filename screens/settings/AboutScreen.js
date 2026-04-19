import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

export default function AboutScreen() {
  const { colors } = useContext(ThemeContext);

  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:colors.background}]}>

      <View style={[styles.hero,{backgroundColor:colors.primary}]}>
        <View style={styles.logo}>
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
        </View>

        <Text style={[styles.appName]}>Secure Notes</Text>
        <Text style={[styles.tagline]}>Safe • Private • Powerful</Text>
      </View>

      <View style={[styles.card,{backgroundColor:colors.card }]}>
        <Text style={[styles.heading,{color:colors.text}]}>About App</Text>
        <Text style={[styles.text,{color:colors.text}]}>
          Secure Notes is a powerful note app designed to keep your data safe 
          with advanced security and smooth user experience.
        </Text>
      </View>

      <View style={[styles.card,{backgroundColor:colors.card}]}>
        <Text style={[styles.heading,{color:colors.text}]}>Features</Text>

        <View style={styles.row}>
          <Ionicons name="lock-closed" size={18} color="#4f46e5" />
          <Text style={[styles.rowText,{color:colors.text}]}> Strong Password Protection</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="color-palette" size={18} color="#10b981" />
          <Text style={[styles.rowText,{color:colors.text}]}> Beautiful UI Experience</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="rocket" size={18} color="#f59e0b" />
          <Text style={[styles.rowText,{color:colors.text}]}> Fast Performance</Text>
        </View>
      </View>

      <View style={[styles.card,{backgroundColor:colors.card}]}>
        <Text style={[styles.heading,{color:colors.text}]}>Developers</Text>

        <TouchableOpacity onPress={()=> Linking.openURL("https://github.com/raju-07")}><Text style={[styles.name,{color:"#e09b06"}]}>Raju Yadav    <Ionicons name='logo-github'/></Text></TouchableOpacity>
        <Text style={[styles.role,{color:colors.textMuted}]}>App Developer</Text>

        <TouchableOpacity onPress={()=> Linking.openURL("https://github.com/rajasinghrajpoot")}><Text style={[styles.name,{color:colors.text}]}>Raja Singh Rajput    <Ionicons name='logo-github'/></Text></TouchableOpacity>
        <Text style={[styles.role,{color:colors.textMuted}]}>UX Designer</Text>

        <TouchableOpacity onPress={()=> Linking.openURL("https://github.com/prachi-jaswal")}><Text style={[styles.name,{color:"#00ff22"}]}>Prachi Jaswal    <Ionicons name='logo-github'/></Text></TouchableOpacity>
        <Text style={[styles.role,{color:colors.textMuted}]}>UI/UX Designer</Text>
      </View>

      <Text style={[styles.footer,{color:colors.text}]}>
        Built with ❤️ Secure Notes
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f5f9",
    paddingBottom: 20,
  },

  hero: {
    backgroundColor: "#4f46e5",
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  logo: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },

  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  tagline: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: -20,
    padding: 16,
    borderRadius: 18,
    elevation: 6,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e293b",
  },

  text: {
    fontSize: 14,
    color: "#475569",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  rowText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#334155",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },

  role: {
    fontSize: 13,
    color: "#64748b",
  },

  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
    fontSize: 14,
  },
});