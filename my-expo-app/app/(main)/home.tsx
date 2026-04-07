import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View>
        <View className="p-8 bg-[#006970]/10 rounded-full mb-8 items-center justify-center">
           <View className="w-24 h-24 bg-[#006970] rounded-3xl" />
        </View>
        <View className="items-center">
          <Text className="text-3xl font-bold text-[#111827]">Home Screen</Text>
          <Text className="text-neutral-500 mt-2">Welcome to RentDirect</Text>
        </View>
      </View>
    </View>
  );
}
