import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/text-translate');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="language" size={80} color="#4F46E5" />
        <Text style={styles.title}>Universal Translator</Text>
        <Text style={styles.subtitle}>Text • Voice • Sign Language</Text>
        <Text style={styles.description}>Powered by AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 16,
  },
});