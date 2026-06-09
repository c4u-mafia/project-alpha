import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View>
        <View className="mb-8 items-center justify-center rounded-full bg-[#006970]/10 p-8">
          <View className="h-24 w-24 rounded-3xl bg-[#006970]" />
        </View>
        <View className="items-center">
          <Text className="text-3xl font-bold text-[#111827]">Home Screen</Text>
          <Text className="mt-2 text-neutral-500">Welcome to Homelyn</Text>
        </View>
      </View>
    </View>
  );
}
