import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';
import { useColorScheme } from 'nativewind';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          height: 85,
          paddingBottom: 25,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#006970',
        tabBarInactiveTintColor: '#A3A3A3',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 22, fontWeight: 'bold' }}>{focused ? '●' : '○'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>{focused ? '✦' : '✧'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>{focused ? '♥' : '♡'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 22, fontWeight: 'bold' }}>{focused ? '👤' : '👤'}</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
