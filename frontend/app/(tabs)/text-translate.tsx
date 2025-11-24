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

const COMMON_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
];

export default function TextTranslate() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/translate`, {
        text: inputText,
        source_language: sourceLang,
        target_language: targetLang,
        service: 'openai',
      });

      setTranslatedText(response.data.translated_text);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Translation failed');
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
  };

  const getLanguageName = (code: string) => {
    return COMMON_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Text Translation</Text>
          <TouchableOpacity onPress={clearAll}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Language Selection */}
          <View style={styles.languageSelector}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowSourcePicker(!showSourcePicker)}
            >
              <Text style={styles.languageText}>{getLanguageName(sourceLang)}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
              <Ionicons name="swap-horizontal" size={24} color="#4F46E5" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowTargetPicker(!showTargetPicker)}
            >
              <Text style={styles.languageText}>{getLanguageName(targetLang)}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Source Language Picker */}
          {showSourcePicker && (
            <View style={styles.pickerContainer}>
              {COMMON_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSourceLang(lang.code);
                    setShowSourcePicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>{lang.name}</Text>
                  {sourceLang === lang.code && (
                    <Ionicons name="checkmark" size={20} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Target Language Picker */}
          {showTargetPicker && (
            <View style={styles.pickerContainer}>
              {COMMON_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.pickerItem}
                  onPress={() => {
                    setTargetLang(lang.code);
                    setShowTargetPicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>{lang.name}</Text>
                  {targetLang === lang.code && (
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
              placeholder="Type or paste text here..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Translate Button */}
          <TouchableOpacity
            style={[styles.translateButton, loading && styles.translateButtonDisabled]}
            onPress={handleTranslate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="language" size={24} color="#FFFFFF" />
                <Text style={styles.translateButtonText}>Translate</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Translated Text */}
          {translatedText ? (
            <View style={styles.resultCard}>
              <Text style={styles.cardLabel}>Translation</Text>
              <Text style={styles.translatedText}>{translatedText}</Text>
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
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  languageButton: {
    flex: 1,
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
  swapButton: {
    marginHorizontal: 8,
    padding: 8,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  translateButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  translateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  translateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
  translatedText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
});
