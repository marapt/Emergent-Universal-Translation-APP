import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SIGN_LANGUAGES = [
  { code: 'ASL', name: 'American Sign Language' },
  { code: 'BSL', name: 'British Sign Language' },
  { code: 'ISL', name: 'Indian Sign Language' },
  { code: 'JSL', name: 'Japanese Sign Language' },
  { code: 'LSF', name: 'French Sign Language' },
  { code: 'Auslan', name: 'Australian Sign Language' },
  { code: 'DGS', name: 'German Sign Language' },
  { code: 'CSL', name: 'Chinese Sign Language' },
];

export default function TextToSign() {
  const [inputText, setInputText] = useState('');
  const [signDescription, setSignDescription] = useState('');
  const [selectedSignLang, setSelectedSignLang] = useState('ASL');
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleConvert = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to convert');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/text-to-sign`, {
        text: inputText,
        sign_language: selectedSignLang,
        service: 'openai',
      });

      setSignDescription(response.data.sign_description);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Text to sign conversion failed');
      console.error('Text to sign error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setInputText('');
    setSignDescription('');
  };

  const getSignLanguageName = (code: string) => {
    return SIGN_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Text to Sign Language</Text>
          <TouchableOpacity onPress={clearAll}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#4F46E5" />
            <Text style={styles.infoText}>
              Enter text and get step-by-step instructions on how to sign it.
            </Text>
          </View>

          {/* Sign Language Selection */}
          <View style={styles.languageSection}>
            <Text style={styles.sectionLabel}>Sign Language</Text>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowPicker(!showPicker)}
            >
              <Text style={styles.languageText}>{getSignLanguageName(selectedSignLang)}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Sign Language Picker */}
          {showPicker && (
            <View style={styles.pickerContainer}>
              {SIGN_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedSignLang(lang.code);
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>{lang.name}</Text>
                  {selectedSignLang === lang.code && (
                    <Ionicons name="checkmark" size={20} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Input Text */}
          <View style={styles.textCard}>
            <Text style={styles.cardLabel}>Enter Text</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Type the text you want to sign..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Convert Button */}
          <TouchableOpacity
            style={[styles.convertButton, loading && styles.convertButtonDisabled]}
            onPress={handleConvert}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="hand-right" size={24} color="#FFFFFF" />
                <Text style={styles.convertButtonText}>Convert to Sign Language</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Sign Description */}
          {signDescription ? (
            <View style={styles.resultCard}>
              <Text style={styles.cardLabel}>How to Sign</Text>
              <Text style={styles.signDescription}>{signDescription}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#4F46E5',
    lineHeight: 20,
  },
  languageSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerText: {
    fontSize: 16,
    color: '#1F2937',
  },
  textCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  convertButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  convertButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  convertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  signDescription: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 24,
  },
});