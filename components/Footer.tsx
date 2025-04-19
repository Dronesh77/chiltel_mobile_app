import { View, Text, Image, Linking, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import React from 'react';

export default function Footer() {
  const { width } = useWindowDimensions();
  
  return (
    <View className="bg-white border-t border-gray-200 pt-6 px-4">
      <ScrollView className="pb-6">
        <View className="flex flex-col gap-8 md:flex-row md:gap-12">

        {/* About Section */}
        <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-4">About Company</Text>
            <Text className="text-sm text-gray-700 leading-relaxed mb-4">
              Chiltel India, founded by Mr. Sudarshan Kuumar Raut in 2021, is a recognized startup in the Home Appliances Sales and Service sector, earning DIIPT recognition from the Indian government in 2022.
            </Text>
            
            {/* Social Icons - With relative sizing */}
            <View className="flex flex-row space-x-3 mt-2">
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.facebook.com/chiltelindia/')}
                className="w-8 h-8 bg-white rounded-full items-center justify-center border border-gray-300 shadow-sm"
              >
                <View className="w-3/4 h-3/4 items-center justify-center">
                  <Image
                    source={require('@/assets/icons/facebook.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.instagram.com/chiltelindiapvtltd/')}
                className="w-8 h-8 bg-white rounded-full items-center justify-center border border-gray-300 shadow-sm"
              >
                <View className="w-3/4 h-3/4 items-center justify-center">
                  <Image
                    source={require('@/assets/icons/instagram.jpeg')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.linkedin.com/company/105363816')}
                className="w-8 h-8 bg-white rounded-full items-center justify-center border border-gray-300 shadow-sm"
              >
                <View className="w-3/4 h-3/4 items-center justify-center">
                  <Image
                    source={require('@/assets/icons/linkedin.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

      {/* Quick Links */}
      <View className="flex-1">
        <Text className="text-xl font-bold text-gray-900 mb-4">Quick Links</Text>
        {[
          { title: 'Home', link: '/' },
          { title: 'About', link: '/about' },
          { title: 'Chill Mart', link: '/collection' },
          { title: 'Contact Us', link: '/contact' },
          { title: 'Blog', link: '/blog' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(item.link)}
            className="py-1.5"
          >
            <Text className="text-sm text-gray-700">• {item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact */}
      <View className="flex-1">
        <Text className="text-xl font-bold text-gray-900 mb-4">Contacts</Text>

        <View className="flex flex-row items-start gap-2">
          <Text className="text-blue-500 mt-1">🏠</Text>
          <Text className="text-sm text-gray-700 leading-relaxed flex-1">
            Shristi Apartment, Flat No - 1 D/2, Nowbhanga, SEC-IV, North 24 Parganas, Kolkata - 700105
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2 mt-3">
          <Text className="text-blue-500">📧</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:info@chiltel.com')}>
            <Text className="text-sm text-gray-700 underline">info@chiltel.com</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 space-y-2">
          <TouchableOpacity
            className="py-1"
            onPress={() => Linking.openURL('https://seller.chiltel.com/')}
          >
            <Text className="text-sm text-gray-700">👤 Register as Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => Linking.openURL('https://partner.chiltel.com/')}
          >
            <Text className="text-sm text-gray-700">👥 Register as Service Partner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Bottom Bar */}
    <View className="border-t border-gray-200 mt-8 pt-4 items-center">
      <Text className="text-gray-500 text-center text-xs leading-5">
        © 2024 Chiltel India Private Limited. All rights reserved.
        {'\n'}CIN: U52100WB2021PTC250206
      </Text>
      <Text className="text-gray-500 text-xs mt-2">🇮🇳 Made in India with Love</Text>
    </View>
  </ScrollView>
</View>

  );
}
