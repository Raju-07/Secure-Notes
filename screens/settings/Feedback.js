
import React, { useContext, useState, useEffect,useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MailComposer from 'expo-mail-composer';
import * as Haptics from 'expo-haptics';

export default function Feedback() {
  const { colors } = useContext(ThemeContext);
  
  // --- UI States ---
  const [activeTab, setActiveTab] = useState('Review'); // Review | Suggestion | Report
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Animation State ---
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const hapticFeedback = (style = 'light') => {
    if (Platform.OS === 'ios') {
      const hapticStyle = style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light;
      Haptics.impactAsync(hapticStyle);
    }
  };

  const handleTabChange = (tab) => {
    hapticFeedback('light');
    setActiveTab(tab);
    setMessage('');
    setRating(0);
  };

  const handleRating = (val) => {
    hapticFeedback('medium');
    setRating(val);
  };

  const onSendFeedback = async () => {
    if (message.length < 10) {
      Alert.alert("Brief Message", "Please provide a bit more detail (min 10 characters).");
      return;
    }

    setIsSubmitting(true);
    
    const isAvailable = await MailComposer.isAvailableAsync();
    
    if (isAvailable) {
      const mailOptions = {
        recipients: ['biostack.site@gmail.com'], 
        subject: `[SECURE-NOTES ${activeTab.toUpperCase()}] From User`,
        body: `
          Category: ${activeTab}
          Rating: ${activeTab === 'Review' ? rating + '/5 Stars' : 'N/A'}
          Device Platform: ${Platform.OS}
          
          User Message:
          --------------------------------------
          ${message}
          --------------------------------------
          Sent via Secure Notes Feedback System.
        `,
      };

      try {
        const result = await MailComposer.composeAsync(mailOptions);
        if (result.status === 'sent') {
          Alert.alert("Success", "Your feedback has been sent to the Secure Notes team!");
          setMessage('');
          setRating(0);
        }
      } catch (error) {
        Alert.alert("Error", "Could not complete the email action.");
      }
    } else {
      Alert.alert("Mail Not Ready", "Your device is not configured to send emails.");
    }
    setIsSubmitting(false);
  };

  // Helper for Section Descriptions
  const getSubtext = () => {
    if (activeTab === 'Review') return "Rate your overall experience with the vault.";
    if (activeTab === 'Suggestion') return "What feature should Raju build next?";
    return "Found a bug? Let the technical team know immediately.";
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.header}>
            <Text style={[styles.brandText, { color: colors.primary }]}>Secure Notes</Text>
            <Text style={[styles.mainTitle, { color: colors.text }]}>Share Feedback</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>{getSubtext()}</Text>
          </View>

          {/* Segmented Controller (Advanced UX) */}
          <View style={[styles.segmentedWrapper, { backgroundColor: colors.card }]}>
            {['Review', 'Suggestion', 'Report'].map((item) => (
              <TouchableOpacity 
                key={item}
                onPress={() => handleTabChange(item)}
                style={[
                  styles.segmentItem, 
                  activeTab === item && { backgroundColor: colors.primary, elevation: 4 }
                ]}
              >
                <Text style={[
                  styles.segmentLabel, 
                  { color: activeTab === item ? '#FFF' : colors.textMuted }
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contextual Input Area */}
          <Animated.View style={[styles.formCard, { opacity: fadeAnim, backgroundColor: colors.card, borderColor: colors.borderColor }]}>
            
            {activeTab === 'Review' && (
              <View style={styles.starSection}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>OVERALL RATING</Text>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                      <Ionicons 
                        name={star <= rating ? "star" : "star-outline"} 
                        size={36} 
                        color={star <= rating ? "#FFD700" : colors.textMuted} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                  {activeTab.toUpperCase()} DETAILS
                </Text>
                <Text style={[styles.charCount, { color: message.length > 400 ? '#FF6B6B' : colors.textMuted }]}>
                  {message.length}/500
                </Text>
              </View>
              <TextInput
                style={[styles.textArea, { color: colors.text, borderColor: colors.borderColor }]}
                placeholder={activeTab === 'Report' ? "Describe the bug exactly as it happened..." : "Type your message here..."}
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={500}
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              disabled={isSubmitting}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]} 
              onPress={onSendFeedback}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? "Processing..." : `Send ${activeTab}`}
              </Text>
              <Ionicons name="paper-plane" size={20} color="#FFF" style={{ marginLeft: 10 }} />
            </TouchableOpacity>

          </Animated.View>

          <View style={styles.footerInfo}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              All feedback is encrypted before transmission.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContainer: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 32 },
  brandText: { fontSize: 14, fontWeight: '900', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' },
  mainTitle: { fontSize: 34, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  segmentedWrapper: { 
    flexDirection: 'row', 
    padding: 6, 
    borderRadius: 18, 
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  segmentItem: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  segmentLabel: { fontSize: 14, fontWeight: '700' },
  formCard: { 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  fieldLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  starSection: { marginBottom: 25, alignItems: 'center' },
  starRow: { flexDirection: 'row', gap: 12 },
  inputSection: { marginBottom: 20 },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  charCount: { fontSize: 11, fontWeight: '600' },
  textArea: { 
    minHeight: 180, 
    borderRadius: 16, 
    borderWidth: 1.5, 
    padding: 16, 
    fontSize: 16, 
    lineHeight: 22,
    marginTop: 8
  },
  submitBtn: { 
    height: 65, 
    borderRadius: 18, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  footerInfo: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, opacity: 0.6 },
  footerText: { fontSize: 12, marginLeft: 8 }
});