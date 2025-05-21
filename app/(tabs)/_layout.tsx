import React from 'react';
import { View, Image, Text, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header/Header';

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
      <View className="flex-1">
        <Header />
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#2874F0',
            tabBarInactiveTintColor: '#828282',
            tabBarItemStyle: {
              width: "100%",
              height: '100%',
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: 6,
              paddingBottom: 0,
            },
            tabBarLabelStyle: {
              fontSize: 9,
              textAlign: 'center',
              includeFontPadding: false,
            },
            tabBarStyle: {
              backgroundColor: "#fff",
              height: 60,
              borderTopWidth: 1,
              borderTopColor: "#e0e0e0",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => renderTabIcon('home-outline', 'Home', focused, color),
            }}
          />
          <Tabs.Screen
            name="chillMart"
            options={{
              title: 'ChillMart',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => renderTabIcon('cart-outline', 'ChillMart', focused, color),
            }}
          />
          <Tabs.Screen
            name="about"
            options={{
              title: 'About',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => renderTabIcon('information-circle-outline', 'About', focused, color),
            }}
          />
          <Tabs.Screen
            name="contact"
            options={{
              title: 'Contact',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => renderTabIcon('call-outline', 'Contact', focused, color),
            }}
          />
          <Tabs.Screen
            name="blog"
            options={{
              title: 'Blog',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => renderTabIcon('document-text-outline', 'Blog', focused, color),
            }}
          />
          <Tabs.Screen
            name="ProductListing"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="ServiceModel"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="Collection"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="BuyNow"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="Orders"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="OrderSuccess"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="ServiceCart"
            options={{
              href: null,
              headerShown: false,
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default Layout;