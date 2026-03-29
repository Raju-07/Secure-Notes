import { useContext, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Modal, Animated, Easing, TouchableWithoutFeedback, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAni = useRef(new Animated.Value(0)).current;
  const { colors, activeTheme } = useContext(ThemeContext);

  const options = [
    { id: '1', name: "Password", icon: 'lock-closed-outline' },
    { id: '2', name: 'Notes', icon: 'document-text-outline' },
    { id: '3', name: 'Events', icon: 'calendar-outline' },
    { id: '4', name: 'PassKey', icon: 'key-outline' },
    { id: '5', name: 'Remind', icon: 'alarm-outline' },
    { id: '6', name: 'Photo', icon: 'image' },
  ];

  const openModal = () => {
    setIsModalVisible(true);
    Animated.spring(slideAni, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const closeModal = () => {
    Animated.timing(slideAni, { toValue: 0, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() => setIsModalVisible(false));
  };

  const translateY = slideAni.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={[styles.headerText, { color: colors.text }]}>Secure Notes</Text>

        <ScrollView contentContainerStyle={styles.scrollBody}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="document-text" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Note Title {item}</Text>
                <Text style={{ color: colors.text + '80', fontSize: 13 }}>Tap to view encrypted content</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <Pressable style={[styles.fab, { backgroundColor: colors.primary }]} onPress={openModal}>
        <Ionicons name="add" size={30} color="white" />
      </Pressable>

      <Modal visible={isModalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={closeModal}><View style={styles.backdropTouchable} /></TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }, Platform.OS === 'android' && { backgroundColor: colors.card }]}>
            {Platform.OS === 'ios' && <BlurView intensity={80} tint={activeTheme} style={StyleSheet.absoluteFill} />}
            <View style={styles.grid}>
              {options.map(o => (
                <Pressable key={o.id} android_ripple={{ color: colors.primary + '33' }} style={({ pressed }) => [styles.cell, { opacity: pressed ? 0.5 : 1 }]} onPress={closeModal}>
                  <Ionicons name={o.icon} size={32} color={colors.primary} />
                  <Text style={[styles.label, { color: colors.text }]}>{o.name}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  headerText: { fontSize: 28, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 20 },
  scrollBody: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  fab: { position: 'absolute', right: 30, bottom: 30, width: 60, height: 55, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  backdropTouchable: { flex: 1 },
  bottomSheet: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: 250, overflow: 'hidden' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.33%', alignItems: 'center', padding: 15 },
  label: { marginTop: 8, fontSize: 12, fontWeight: '500' }
});