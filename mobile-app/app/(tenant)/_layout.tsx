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
        }}>
        {label}
      </Text>
    </View>
  );
}

export default function TenantLayout() {
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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'search' : 'search-outline'}
              focused={focused}
              label="Search"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rent"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'card' : 'card-outline'} focused={focused} label="Rent" />
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
