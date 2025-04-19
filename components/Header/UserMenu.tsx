import { View, Text, TouchableOpacity } from 'react-native';

export default function UserMenu() {
  return (
    <View className="relative">
      <TouchableOpacity className="w-9 h-9 border border-gray-200 rounded-full items-center justify-center">
        <Text>👤</Text>
      </TouchableOpacity>
      {/* TODO: Add dropdown menu on press */}
    </View>
  );
}
