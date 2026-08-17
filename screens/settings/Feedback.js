import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feedback() {
  const { colors } = useContext(ThemeContext);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendFeedback = async () => {
    // Validation
    if (!subject.trim()) {
      Alert.alert('Subject Required', 'Please enter a subject for your feedback.');
      return;
    }
    
    if (message.length < 10) {
      Alert.alert('Message Too Short', 'Please provide at least 10 characters of detail.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Encode the subject and body for URL
      const encodedSubject = encodeURIComponent(`[Feedback] ${subject}`);
      const encodedBody = encodeURIComponent(`
        ${message}
        
        ---
        Sent from Secure Notes App
        Platform: ${Platform.OS}
      `);

      // Create mailto URL
      const mailtoUrl = `mailto:nextgencoders06@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Check if mailto is supported
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        // Clear form after opening mail
        setSubject('');
        setMessage('');
        Alert.alert('Success', 'Mail app opened successfully!');
      } else {
        Alert.alert('Error', 'No email app found on your device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open mail app. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Send Feedback</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Help us improve Secure Notes
            </Text>
          </View>

          {/* Form */}
          <View style={[styles.form, { backgroundColor: colors.card }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Subject</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: colors.text, 
                    borderColor: colors.borderColor,
                    backgroundColor: colors.background 
                  }
                ]}
                placeholder="What is this about?"
                placeholderTextColor={colors.textMuted}
                value={subject}
                onChangeText={setSubject}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Message</Text>
                <Text style={[styles.charCount, { color: colors.textMuted }]}>
                  {message.length}/500
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textArea, 
                  { 
                    color: colors.text, 
                    borderColor: colors.borderColor,
                    backgroundColor: colors.background 
                  }
                ]}
                placeholder="Describe your feedback in detail..."
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
              style={[
                styles.submitBtn, 
                { 
                  backgroundColor: isSubmitting ? colors.textMuted : colors.primary,
                  opacity: isSubmitting ? 0.6 : 1 
                }
              ]} 
              onPress={sendFeedback}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Opening Mail...' : 'Send Feedback'}
              </Text>
              <Ionicons 
                name="send" 
                size={20} 
                color="#FFF" 
                style={styles.sendIcon} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={14} color={colors.textMuted} />
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Opens your default mail app
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  form: { padding: 20, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  inputGroup: { marginBottom: 18 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, fontSize: 15 },
  textArea: { minHeight: 140, borderRadius: 12, borderWidth: 1.5, padding: 14, fontSize: 15, lineHeight: 22 },
  charCount: { fontSize: 12, fontWeight: '500' },
  submitBtn: { height: 54, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  sendIcon: { marginLeft: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 6 },
  footerText: { fontSize: 12, opacity: 0.7 },
});