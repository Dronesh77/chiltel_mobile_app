import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useState, useRef } from 'react';
import Logo from './Logo';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';
import CartIcon from './CartIcon';
import { useRouter } from 'expo-router';

import HomeIcon from '@/assets/icons/home-icon.png';
import ShopIcon from '@/assets/icons/shop-icon.png';
import InfoIcon from '@/assets/icons/info-icon.png';
import ContactIcon from '@/assets/icons/contact-icon.png';
import BlogIcon from '@/assets/icons/blog-icon.png';
import CartImg from '@/assets/icons/cart-icon.png';

const { width } = Dimensions.get('window');

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;

  const navItems = [
    { label: 'HOME', route: '/', icon: HomeIcon },
    { label: 'CHILL MART', route: '/(tabs)/chillMart', icon: ShopIcon },
    { label: 'ABOUT', route: '/(tabs)/about', icon: InfoIcon },
    { label: 'CONTACT', route: '/(tabs)/contact', icon: ContactIcon },
    { label: 'BLOG', route: '/(tabs)/blog', icon: BlogIcon },
  ];

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuOpen(false));
  };

  const handleNav = (route: string) => {
    closeMenu();
    router.push(route as any);
  };

  return (
    <>
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Logo />
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
            <UserMenu />
            <CartIcon />
            <MobileMenuButton onPress={openMenu} />
          </View>
        </View>
      </View>

      {/* Custom Slide-In Drawer */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View className="absolute inset-0 bg-black/40 flex-row justify-end z-50">
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  width: width * 0.75,
                  height: '100%',
                  backgroundColor: 'white',
                  padding: 24,
                  transform: [{ translateX: slideAnim }],
                }}
              >
                {/* Top: Logo + Close Button */}
                <View className="flex-row justify-between items-center mb-6">
                  <Logo />
                  <TouchableOpacity onPress={closeMenu}>
                    <Image source={require('@/assets/icons/close-icon.png')} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>
                </View>

                {/* Main Navigation Items */}
                {navItems.map(({ label, route, icon }) => (
                  <TouchableOpacity
                    key={route}
                    onPress={() => handleNav(route)}
                    className="py-3 border-b border-gray-200 flex-row items-center gap-3"
                  >
                    <Image source={icon} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                    <Text className="text-base font-semibold text-gray-700">{label}</Text>
                  </TouchableOpacity>
                ))}

                {/* Divider */}
                <View className="my-4 border-t border-gray-200" />

                {/* Login */}
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push('/login');
                  }}
                  className="py-3 flex-row items-center gap-3"
                >
                  <Image source={require('@/assets/icons/login-icon.png')} style={{ width: 20, height: 20 }} />
                  <Text className="text-base font-semibold text-gray-700">Login</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View className="my-4 border-t border-gray-200" />

                {/* Cart */}
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push('/cart');
                  }}
                  className="py-3 bg-gray-100 rounded-lg flex-row items-center gap-3 px-3"
                >
                  <Image source={require('@/assets/icons/cart-icon.png')} style={{ width: 20, height: 20 }} />
                  <Text className="text-base font-semibold text-gray-700">Cart</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
