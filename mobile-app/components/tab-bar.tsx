import React from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './ui/text';

interface Route {
  key: string;
  name: string;
}

interface TabBarProps {
  state: { routes: Route[]; index: number };
  descriptors: Record<
    string,
    {
      options: {
        tabBarIcon?: (p: { focused: boolean; color: string; size: number }) => React.ReactNode;
        title?: string;
      };
    }
  >;
  navigation: {
    emit: (e: { type: string; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
}

const TEAL = '#0E7C7B';
const GRAY = '#9CA3AF';

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? TEAL : GRAY;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.65}
            style={styles.item}>
            {/* Top indicator */}
            <View style={[styles.pip, focused && styles.pipActive]} />

            {/* Icon */}
            <View style={styles.iconWrap}>
              {options.tabBarIcon?.({ focused, color, size: 23 })}
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                { color, fontFamily: focused ? 'Geist_600SemiBold' : 'Geist_400Regular' },
              ]}>
              {options.title ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#1A2332',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.055,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  pip: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: 'transparent',
  },
  pipActive: {
    backgroundColor: TEAL,
  },
  iconWrap: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: 0.1,
  },
});
