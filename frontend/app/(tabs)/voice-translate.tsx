import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

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
];

export default function VoiceTranslate() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [audioBase64, setAudioBase64] = useState('');

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please grant microphone permission');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        await processAudio(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const processAudio = async (audioUri: string) => {
    setLoading(true);
    try {
      // Read audio file as base64
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: 'base64',
      });

      // Send to backend for transcription and translation
      const response = await axios.post(`${BACKEND_URL}/api/voice-translate`, {
        audio_base64: audioBase64,
        source_language: sourceLang,
        target_language: targetLang,
        service: 'openai',
      });

      setTranscribedText(response.data.transcribed_text);
      setTranslatedText(response.data.translated_text);
      setAudioBase64(response.data.audio_base64);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Voice translation failed');
      console.error('Voice translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const playTranslatedAudio = async () => {
    if (!audioBase64) return;

    try {
      // Stop any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Save base64 audio to temp file
      const fileUri = `${FileSystem.cacheDirectory}translated.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, audioBase64, {
        encoding: BASE64_ENCODING,
      });

      // Play audio
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play audio', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const clearAll = () => {
    setTranscribedText('');
    setTranslatedText('');
    setAudioBase64('');
  };

  const getLanguageName = (code: string) => {
    return COMMON_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Translation</Text>
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

          <Ionicons name="arrow-forward" size={24} color="#4F46E5" style={{ marginHorizontal: 8 }} />

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

        {/* Recording Button */}
        <View style={styles.recordingSection}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={loading}
          >
            <Ionicons
              name={isRecording ? 'stop-circle' : 'mic'}
              size={64}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Text style={styles.recordText}>
            {isRecording ? 'Tap to Stop Recording' : 'Tap to Start Recording'}
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {/* Results */}
        {transcribedText ? (
          <View style={styles.resultCard}>
            <Text style={styles.cardLabel}>What You Said</Text>
            <Text style={styles.resultText}>{transcribedText}</Text>
          </View>
        ) : null}

        {translatedText ? (
          <View style={styles.translationCard}>
            <Text style={styles.cardLabel}>Translation</Text>
            <Text style={styles.resultText}>{translatedText}</Text>
            
            {audioBase64 && (
              <TouchableOpacity style={styles.playButton} onPress={playTranslatedAudio}>
                <Ionicons name="play-circle" size={32} color="#4F46E5" />
                <Text style={styles.playButtonText}>Play Translation</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  recordingSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  recordText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  translationCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  playButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
});