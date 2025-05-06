import { View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import profileIcon from '@/assets/icons/profile-icon.png';
import cartIcon from '@/assets/icons/cart-icon.jpeg';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  return (
    <View style={{ paddingTop: insets.top - 50, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
      <View className="flex-row items-center justify-between pr-4">
        <Logo />
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
          <TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => router.push(isAuthenticated ? '/profile' : '/login')}>
                <Image
                  source={profileIcon}
                  resizeMode="cover"
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => router.push(isAuthenticated ? '/cart' : '/login')}>
                <Image
                  source={cartIcon}
                  resizeMode="cover"
                  style={{
                    width: 28,
                    height: 28,
                  }}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
