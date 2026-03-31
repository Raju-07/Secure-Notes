import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 🔥 HERO SECTION */}
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
        </View>

        <Text style={styles.appName}>Secure Notes</Text>
        <Text style={styles.tagline}>Safe • Private • Powerful</Text>
      </View>

      {/* 📦 FLOATING CARD */}
      <View style={styles.card}>
        <Text style={styles.heading}>About App</Text>
        <Text style={styles.text}>
          Secure Notes is a powerful note app designed to keep your data safe 
          with advanced security and smooth user experience.
        </Text>
      </View>

      {/* ⚡ FEATURES */}
      <View style={styles.card}>
        <Text style={styles.heading}>Features</Text>

        <View style={styles.row}>
          <Ionicons name="lock-closed" size={18} color="#4f46e5" />
          <Text style={styles.rowText}> Strong Password Protection</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="color-palette" size={18} color="#10b981" />
          <Text style={styles.rowText}> Beautiful UI Experience</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="rocket" size={18} color="#f59e0b" />
          <Text style={styles.rowText}> Fast Performance</Text>
        </View>
      </View>

      {/* 👨‍💻 DEVELOPERS */}
      <View style={styles.card}>
        <Text style={styles.heading}>Developers</Text>

        <Text style={styles.name}>Raju Yadav</Text>
        <Text style={styles.role}>App Developer</Text>

        <Text style={styles.name}>Raja Singh Rajput</Text>
        <Text style={styles.role}>UX Designer</Text>

        <Text style={styles.name}>Prachi Jaswal</Text>
        <Text style={styles.role}>UI/UX Designer</Text>
      </View>

      {/* ❤️ FOOTER */}
      <Text style={styles.footer}>
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

  /* 🔥 HERO */
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

  /* 📦 CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: -20, // 👈 floating effect
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

  /* ⚡ ROW */
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

  /* 👨‍💻 DEV */
  name: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },

  role: {
    fontSize: 13,
    color: "#64748b",
  },

  /* ❤️ FOOTER */
  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
    fontSize: 14,
  },
});