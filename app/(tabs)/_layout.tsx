import React from 'react';
import { View, Image, Text, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/Header/Header';
import ShopContextProvider from '@/context/ShopContext';
import { AuthProvider } from '@/context/AuthContext';
import { ServiceCartProvider } from '@/context/ServiceCartContext';

const Layout = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, 10) : insets.bottom;

  const renderTabIcon = (
    iconName: keyof typeof Ionicons.glyphMap,
    name: string,
    focused: boolean,
    color: string
  ) => (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: 72,
      paddingHorizontal: 0
    }}>
      <Ionicons
        name={iconName}
        size={24}
        color={color}
        style={{ marginBottom: 2 }}
      />
      <Text
        style={{
          fontSize: 12,
          color,
          fontWeight: focused ? '600' : '400',
          textAlign: 'center',
          lineHeight: 12,
        }}
      >
        {name}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ShopContextProvider>
        <AuthProvider>
          <ServiceCartProvider>
            <View style={{ flex: 1 }}>
              <Header />

              <Tabs
                screenOptions={{
                  headerShown: false,
                  tabBarShowLabel: false,
                  tabBarActiveTintColor: '#2874F0',
                  tabBarInactiveTintColor: '#9e9e9e',
                  tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 0,
                    paddingBottom: 0,
                    minHeight: 48,
                  },
                  tabBarStyle: {
                    backgroundColor: '#ffffff',
                    height: 7 + bottomInset,
                    paddingTop: 10,
                    paddingBottom: bottomInset,
                    borderTopWidth: 1,
                    borderTopColor: '#d1d1d1',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    elevation: 8,
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: -3 },
                    shadowRadius: 3,
                    shadowColor: '#000',
                  },
                }}
              >
                <Tabs.Screen
                  name="index"
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => renderTabIcon('home-outline', 'Home', focused, color),
                  }}
                />
                <Tabs.Screen
                  name="chillMart"
                  options={{
                    title: 'ChillMart',
                    tabBarIcon: ({ color, focused }) => renderTabIcon('cart-outline', 'ChillMart', focused, color),
                  }}
                />
                <Tabs.Screen
                  name="about"
                  options={{
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => renderTabIcon('information-circle-outline', 'About', focused, color),
                  }}
                />
                <Tabs.Screen
                  name="contact"
                  options={{
                    title: 'Contact',
                    tabBarIcon: ({ color, focused }) => renderTabIcon('call-outline', 'Contact', focused, color),
                  }}
                />
                <Tabs.Screen
                  name="blog"
                  options={{
                    title: 'Blog',
                    tabBarIcon: ({ color, focused }) => renderTabIcon('document-text-outline', 'Blog', focused, color),
                  }}
                />

                {/* Hidden screens */}
                <Tabs.Screen name="ProductListing" options={{ href: null }} />
                <Tabs.Screen name="cart" options={{ href: null }} />
                <Tabs.Screen name="ServiceModel" options={{ href: null }} />
                <Tabs.Screen name="Collection" options={{ href: null }} />
                <Tabs.Screen name="login" options={{ href: null }} />
              </Tabs>
            </View>
          </ServiceCartProvider>
        </AuthProvider>
      </ShopContextProvider>
    </SafeAreaView>
  );
};

export default Layout;