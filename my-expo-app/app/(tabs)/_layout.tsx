import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#006970',
        tabBarInactiveTintColor: '#A3A3A3',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 24 }}>{focused ? '🏠' : '🏚'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'EXPLORE',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-[#006970]/10 p-2 rounded-xl' : ''}>
              <Text style={{ color, fontSize: 24 }}>🔍</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarLabel: 'SAVED',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 24 }}>{focused ? '❤️' : '🤍'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Text style={{ color, fontSize: 24 }}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
