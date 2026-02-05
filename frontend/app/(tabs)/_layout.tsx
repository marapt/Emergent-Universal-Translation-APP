import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="text-translate"
        options={{
          title: 'Text',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voice-translate"
        options={{
          title: 'Voice',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sign-to-text"
        options={{
          title: 'Sign→Text',
          tabBarIcon: ({ color, size}) => (
            <Ionicons name="hand-left" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="text-to-sign"
        options={{
          title: 'Text→Sign',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hand-right" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}