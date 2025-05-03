import { View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import profileIcon from '@/assets/icons/profile-icon.png';
import cartIcon from '@/assets/icons/cart-icon.jpeg';

export default function Header() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Logo />
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
          <TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={profileIcon}
                resizeMode="cover"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={cartIcon}
                resizeMode="cover"
                style={{
                  width: 28,
                  height: 28,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
