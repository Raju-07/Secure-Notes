import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FeedbackScreen() {

  const [showOptions, setShowOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const openForm = (t) => {
    setType(t);
    setShowOptions(false);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    console.log(type, message);
    setModalVisible(false);
    setMessage("");
    alert("Submitted ✅");
  };

  return (
    <View style={styles.container}>

      {/* 🔥 MAIN BUTTON */}
      <TouchableOpacity
        style={styles.mainBtn}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Ionicons name="sparkles" size={22} color="#fff" />
        <Text style={styles.mainText}>Give Feedback</Text>
      </TouchableOpacity>

      {/* 🔥 CARD OPTIONS */}
      {showOptions && (
        <View style={styles.cardBox}>

          <TouchableOpacity style={styles.card} onPress={() => openForm("Review")}>
            <Ionicons name="star" size={24} color="#f59e0b" />
            <View>
              <Text style={styles.cardTitle}>Review</Text>
              <Text style={styles.cardSub}>Share your experience</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => openForm("Report")}>
            <Ionicons name="warning" size={24} color="#ef4444" />
            <View>
              <Text style={styles.cardTitle}>Report</Text>
              <Text style={styles.cardSub}>Report any issue</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => openForm("Suggestion")}>
            <Ionicons name="bulb" size={24} color="#10b981" />
            <View>
              <Text style={styles.cardTitle}>Suggestion</Text>
              <Text style={styles.cardSub}>Give improvement ideas</Text>
            </View>
          </TouchableOpacity>

        </View>
      )}

      {/* 🔥 MODAL (BOTTOM SHEET STYLE) */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.overlay}
        >

          <View style={styles.bottomSheet}>

            <View style={styles.dragBar} />

            <Text style={styles.title}>{type}</Text>

            <TextInput
              placeholder={`Write your ${type}...`}
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
  },

  /* 🔥 MAIN BUTTON */
  mainBtn: {
    flexDirection: "row",
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    elevation: 6,
  },

  mainText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  /* 🔥 CARD BOX */
  cardBox: {
    marginTop: 20,
    width: "90%",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    color: "#1e293b",
  },

  cardSub: {
    fontSize: 13,
    marginLeft: 10,
    color: "#64748b",
  },

  /* 🔥 MODAL */
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  dragBar: {
    width: 50,
    height: 5,
    backgroundColor: "#cbd5e1",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 15,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: "#6366f1",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});