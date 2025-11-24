import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function SignToText() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [interpretedText, setInterpretedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant photo library permission');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      await interpretSignLanguage(result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await Camera.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant camera permission');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      await interpretSignLanguage(result.assets[0].base64);
    }
  };

  const interpretSignLanguage = async (base64Image: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/sign-to-text`, {
        image_base64: base64Image,
        target_language: 'en',
        service: 'openai',
      });

      setInterpretedText(response.data.interpreted_text);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Sign language interpretation failed');
      console.error('Sign interpretation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImageUri(null);
    setInterpretedText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign Language to Text</Text>
        <TouchableOpacity onPress={clearAll}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" />
          <Text style={styles.infoText}>
            Capture or upload a photo of sign language gestures to interpret them using AI.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Ionicons name="camera" size={32} color="#4F46E5" />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Ionicons name="images" size={32} color="#4F46E5" />
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.imageCard}>
            <Text style={styles.cardLabel}>Sign Language Image</Text>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Analyzing sign language...</Text>
          </View>
        )}

        {/* Interpretation Result */}
        {interpretedText ? (
          <View style={styles.resultCard}>
            <Text style={styles.cardLabel}>Interpretation</Text>
            <Text style={styles.resultText}>{interpretedText}</Text>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    textAlign: 'center',
  },
  imageCard: {
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
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
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
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  resultText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
});