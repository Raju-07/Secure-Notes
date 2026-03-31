import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Vibration
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FeedbackScreen() {

  const [rating, setRating] = useState(0);
  const [emoji, setEmoji] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emojis = ["😡", "😕", "😐", "😊", "😍"];

  const handleSubmit = () => {

    // ❌ validation
    if (rating === 0 && emoji === "" && message.trim() === "") {
      Alert.alert("Error ❌", "Please give some feedback first!");
      return;
    }

    const data = {
      rating,
      emoji,
      message,
      time: new Date().toLocaleString()
    };

    // 🔥 console log
    console.log("📩 Feedback Data:", data);

    // 📳 vibration
    Vibration.vibrate(200);

    // 📱 alert (delay fix)
    setTimeout(() => {
      Alert.alert("Success ✅", "Feedback submitted!");
    }, 100);

    // 🎉 success screen
    setTimeout(() => {
      setSubmitted(true);
    }, 300);
  };

  // 🎉 SUCCESS SCREEN
  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
        <Text style={styles.successText}>Thank You!</Text>
        <Text style={styles.successSub}>Your feedback has been submitted</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>We value your feedback</Text>
      </View>

      {/* 😍 EMOJI */}
      <View style={styles.emojiRow}>
        {emojis.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setEmoji(item)}
            style={[
              styles.emojiBox,
              emoji === item && styles.emojiActive
            ]}
          >
            <Text style={styles.emoji}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ⭐ STARS */}
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={30}
              color="#f59e0b"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 💬 INPUT */}
      <TextInput
        placeholder="Tell us what you think..."
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        multiline
      />

      {/* 🔘 BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },

  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  emojiBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },

  emojiActive: {
    backgroundColor: "#6366f1",
  },

  emoji: {
    fontSize: 24,
  },

  ratingRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#6366f1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  successText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  successSub: {
    fontSize: 14,
    color: "#64748b",
  },
});