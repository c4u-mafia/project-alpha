import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';

function TabIcon({
  name,
  focused,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  label: string;
}) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 6 }}>
      <Ionicons name={name} size={22} color={focused ? '#0E7C7B' : '#A0A0A8'} />
      <Text
        style={{
          fontFamily: focused ? 'Geist_600SemiBold' : 'Geist_400Regular',
          fontSize: 10,
          color: focused ? '#0E7C7B' : '#A0A0A8',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function LandlordLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0EBE4',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 6,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} label="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'business' : 'business-outline'} focused={focused} label="Properties" />
          ),
        }}
      />
      <Tabs.Screen
        name="tenants"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'people' : 'people-outline'} focused={focused} label="Tenants" />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} label="Me" />
          ),
        }}
      />
    </Tabs>
  );
}
