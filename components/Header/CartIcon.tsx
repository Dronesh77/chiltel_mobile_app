import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function CartIcon() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push('/(tabs)/cart')}
      className="w-9 h-9 border border-gray-200 rounded-full items-center justify-center"
    >
      <Text>🛒</Text>
    </TouchableOpacity>
  );
}
