import { SafeAreaView, View } from 'react-native'
import Header from '@/components/Header/Header'
import { Slot } from 'expo-router'
import ShopContextProvider from '@/context/ShopContext'
import { AuthProvider } from '@/context/AuthContext'
import { Tabs } from 'expo-router'
import TabIcon from '@/components/TabIcon'

import homeIcon from '@/assets/icons/home-icon.png';
import shopIcon from '@/assets/icons/shop-icon.png';
import infoIcon from '@/assets/icons/info-icon.png';
import contactIcon from '@/assets/icons/contact-icon.png';
import blogIcon from '@/assets/icons/blog-icon.png';

const _layout = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ShopContextProvider>
        <AuthProvider>
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
                  tabBarIcon: ({ color, focused }) => (
                    <TabIcon focused={focused} icon={homeIcon} name="Home" color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="chillMart"
                options={{
                  title: 'ChillMart',
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <TabIcon focused={focused} icon={shopIcon} name="ChillMart" color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="about"
                options={{
                  title: 'About',
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <TabIcon focused={focused} icon={infoIcon} name="About" color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="contact"
                options={{
                  title: 'Contact',
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <TabIcon focused={focused} icon={contactIcon} name="Contact" color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="blog"
                options={{
                  title: 'Blog',
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <TabIcon focused={focused} icon={blogIcon} name="Blog" color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="ProductListing"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="cart"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="ServiceModel"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="Collection"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="login"
                options={{
                  href: null,
                }}
              />
            </Tabs>
          </View>
        </AuthProvider>
      </ShopContextProvider>
    </SafeAreaView>
  )
}

export default _layout