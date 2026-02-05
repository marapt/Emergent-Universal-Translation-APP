import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OPENAI_KEY_STORAGE = '@openai_api_key';
const PREMIUM_ENABLED_STORAGE = '@premium_enabled';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [premiumEnabled, setPremiumEnabled] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const key = await AsyncStorage.getItem(OPENAI_KEY_STORAGE);
      const enabled = await AsyncStorage.getItem(PREMIUM_ENABLED_STORAGE);
      
      if (key) {
        setSavedKey(key);
        setApiKey(key);
      }
      if (enabled === 'true') {
        setPremiumEnabled(true);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      Alert.alert('Invalid Key', 'OpenAI API keys start with "sk-"');
      return;
    }

    try {
      await AsyncStorage.setItem(OPENAI_KEY_STORAGE, apiKey);
      await AsyncStorage.setItem(PREMIUM_ENABLED_STORAGE, 'true');
      setSavedKey(apiKey);
      setPremiumEnabled(true);
      Alert.alert(
        'Success!',
        'Premium features unlocked! You can now use Voice Translation and Sign Language to Text.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
      console.error('Save error:', error);
    }
  };

  const clearApiKey = async () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure? This will disable premium features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(OPENAI_KEY_STORAGE);
              await AsyncStorage.setItem(PREMIUM_ENABLED_STORAGE, 'false');
              setApiKey('');
              setSavedKey('');
              setPremiumEnabled(false);
              Alert.alert('Cleared', 'Premium features disabled');
            } catch (error) {
              console.error('Clear error:', error);
            }
          },
        },
      ]
    );
  };

  const openOpenAIWebsite = () => {
    Linking.openURL('https://platform.openai.com/account/api-keys');
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 10) return key;
    return `${key.slice(0, 7)}...${key.slice(-4)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons
              name={premiumEnabled ? 'star' : 'star-outline'}
              size={32}
              color={premiumEnabled ? '#F59E0B' : '#9CA3AF'}
            />
            <Text style={styles.statusTitle}>
              {premiumEnabled ? 'Premium Enabled' : 'Free Plan'}
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            {premiumEnabled
              ? 'You have access to all features including Voice Translation and Sign Language to Text.'
              : 'You have access to Text Translation, Text to Sign Language, and History. Upgrade to unlock premium features.'}
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.featureTitle}>Text Translation</Text>
            </View>
            <Text style={styles.featureDescription}>
              Translate between 108+ languages • Always Free
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.featureTitle}>Text to Sign Language</Text>
            </View>
            <Text style={styles.featureDescription}>
              8 sign languages supported • Always Free
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.featureTitle}>Translation History</Text>
            </View>
            <Text style={styles.featureDescription}>
              View all your translations • Always Free
            </Text>
          </View>

          <View style={[styles.featureCard, !premiumEnabled && styles.featureDisabled]}>
            <View style={styles.featureHeader}>
              <Ionicons
                name={premiumEnabled ? 'checkmark-circle' : 'lock-closed'}
                size={24}
                color={premiumEnabled ? '#10B981' : '#9CA3AF'}
              />
              <Text style={styles.featureTitle}>Voice Translation</Text>
              {!premiumEnabled && <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>}
            </View>
            <Text style={styles.featureDescription}>
              Speech-to-text and text-to-speech translation
            </Text>
          </View>

          <View style={[styles.featureCard, !premiumEnabled && styles.featureDisabled]}>
            <View style={styles.featureHeader}>
              <Ionicons
                name={premiumEnabled ? 'checkmark-circle' : 'lock-closed'}
                size={24}
                color={premiumEnabled ? '#10B981' : '#9CA3AF'}
              />
              <Text style={styles.featureTitle}>Sign Language to Text</Text>
              {!premiumEnabled && <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>}
            </View>
            <Text style={styles.featureDescription}>
              AI-powered sign language interpretation
            </Text>
          </View>
        </View>

        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unlock Premium Features</Text>
          <Text style={styles.sectionDescription}>
            Add your OpenAI API key to enable Voice Translation and Sign Language to Text.
            Your key is stored securely on your device only.
          </Text>

          {savedKey ? (
            <View style={styles.savedKeyCard}>
              <View style={styles.savedKeyHeader}>
                <Ionicons name="key" size={20} color="#4F46E5" />
                <Text style={styles.savedKeyLabel}>Your API Key</Text>
              </View>
              <Text style={styles.savedKeyValue}>
                {showKey ? savedKey : maskApiKey(savedKey)}
              </Text>
              <View style={styles.savedKeyActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowKey(!showKey)}
                >
                  <Ionicons
                    name={showKey ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                  <Text style={styles.actionButtonText}>
                    {showKey ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonDanger]}
                  onPress={clearApiKey}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                  <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>OpenAI API Key</Text>
                <TextInput
                  style={styles.input}
                  placeholder="sk-..."
                  placeholderTextColor="#9CA3AF"
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry={!showKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowKey(!showKey)}
                >
                  <Ionicons
                    name={showKey ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveApiKey}>
                <Ionicons name="save" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save API Key</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton} onPress={openOpenAIWebsite}>
                <Ionicons name="open" size={16} color="#4F46E5" />
                <Text style={styles.linkButtonText}>Get OpenAI API Key</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How This Works</Text>
            <Text style={styles.infoText}>
              • Free features use our shared AI service{'\n'}
              • Premium features use your personal OpenAI account{'\n'}
              • Your API key never leaves your device{'\n'}
              • You control your own usage and costs{'\n'}
              • Typical cost: $5-10/month for moderate use
            </Text>
          </View>
        </View>
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureDisabled: {
    opacity: 0.6,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 32,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    paddingRight: 40,
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 50,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  linkButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  savedKeyCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  savedKeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedKeyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 8,
  },
  savedKeyValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  savedKeyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonDanger: {
    // no additional style needed
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  actionButtonTextDanger: {
    color: '#EF4444',
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4F46E5',
    lineHeight: 20,
  },
});
