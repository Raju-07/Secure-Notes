import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppTheme(){
  const [IsSystem, setIsSystem] = useState(true);
  const [IsLight, setIsLight] = useState(false);
  const [IsDark, setIsDark] = useState(false);

  const toggleSystem = () => {
    setIsSystem(true);
    setIsLight(false);
    setIsDark(false);
  };

  const toggleLight = () => {
    setIsLight(true);
    setIsDark(false);
    setIsSystem(false);
  };

  const toggleDark = () => {
    setIsDark(true);
    setIsLight(false);
    setIsSystem(false);
  };

  return (
    <View style={styles.container}>
      
      {/* CURRENT THEME */}
      <Text style={styles.title}>Current Theme</Text>

      <View style={styles.header}>
        <View style={styles.together}>
          <Ionicons
            name={
              IsSystem
                ? "cog-outline"
                : IsLight
                ? "sunny-outline"
                : "moon-outline"
            }
            size={28}
          />
          <Text style={styles.option}>
            {IsSystem ? "System" : IsLight ? "Light Theme" : "Dark Theme"}
          </Text>
        </View>

        <View style={styles.switchWrapper}>
          <Switch
            value={true}
            disabled
            thumbColor={"pink"}
            trackColor={{ false: "#d7c6c6", true: "#d6aad6" }}
          />
        </View>
      </View>

      {/* SELECT THEME */}
      <Text style={styles.title}>Select Theme</Text>

      {/* SYSTEM */}
      <View style={styles.header}>
        <View style={styles.together}>
          <Ionicons name="cog-outline" size={28} />
          <Text style={styles.option}>System</Text>
        </View>

        <View style={styles.switchWrapper}>
          <Switch
            value={IsSystem}
            onValueChange={toggleSystem}
            disabled={IsSystem}
            thumbColor={IsSystem ? "pink" : "white"}
            trackColor={{ false: "#d7c6c6", true: "#d6aad6" }}
          />
        </View>
      </View>

      {/* LIGHT */}
      <View style={styles.header}>
        <View style={styles.together}>
          <Ionicons name="sunny-outline" size={28} />
          <Text style={styles.option}>Light Theme</Text>
        </View>

        <View style={styles.switchWrapper}>
          <Switch
            value={IsLight}
            onValueChange={toggleLight}
            disabled={IsLight}
            thumbColor={IsLight ? "pink" : "white"}
            trackColor={{ false: "#d7c6c6", true: "#d6aad6" }}
          />
        </View>
      </View>

      {/* DARK */}
      <View style={styles.header}>
        <View style={styles.together}>
          <Ionicons name="moon-outline" size={28} />
          <Text style={styles.option}>Dark Theme</Text>
        </View>

        <View style={styles.switchWrapper}>
          <Switch
            value={IsDark}
            onValueChange={toggleDark}
            disabled={IsDark}
            thumbColor={IsDark ? "pink" : "white"}
            trackColor={{ false: "#d7c6c6", true: "#d6aad6" }}
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 20,
    color: "#1E293B",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#6cc2ad18",
    borderRadius: 15,
  },

  together: {
    flexDirection: "row",
    alignItems: "center",
  },

  option: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
    color: "#334155",
  },

  switchWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2, // iOS alignment fix
  },
});