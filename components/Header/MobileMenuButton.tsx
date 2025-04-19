import { TouchableOpacity, Text } from 'react-native';

export default function MobileMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-9 h-9 border border-gray-200 rounded-full items-center justify-center"
    >
      <Text>☰</Text>
    </TouchableOpacity>
  );
}
