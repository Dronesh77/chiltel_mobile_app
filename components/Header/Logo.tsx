import { Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Logo() {
  return (
    <Link href="/" asChild>
      <TouchableOpacity>
        <Image
          source={require('@/assets/icons/logoc.png')}
          style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    </Link>
  );
}
