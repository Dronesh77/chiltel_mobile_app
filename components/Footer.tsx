import { useWindowDimensions, View, Text, Image, Linking, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

const Footer = () => {
  const { width } = useWindowDimensions();

  // Adjusted responsive sizing for icons, buttons, and fonts
  const iconSize = width * 0.1;  // Increased icon size to 10% of screen width
  const buttonSize = width * 0.16;  // Increased button size for better touch area
  const iconSpacing = 14;  // Increased spacing between icons

  // Dynamic font sizes based on screen width with a minimum value for readability
  const headingFontSize = Math.max(width * 0.06, 18);  // Increased for better visibility, min 18px
  const textFontSize = Math.max(width * 0.04, 14);  // Increased body text font size, min 14px
  const smallTextFontSize = Math.max(width * 0.03, 12);  // Footer text size, min 12px

  return (
    <View className="bg-white border-t border-gray-200 pt-6 px-4">
      <ScrollView className="pb-6">
        <View className="flex flex-col gap-8 md:flex-row md:gap-12">

          {/* About Section */}
          <View className="flex-1">
            <Text className="font-bold text-gray-900 mb-4" style={{ fontSize: headingFontSize }}>
              About Company
            </Text>
            <Text className="text-gray-700 leading-relaxed mb-4" style={{ fontSize: textFontSize }}>
              Chiltel India, founded by Mr. Sudarshan Kuumar Raut in 2021, is a recognized startup in the Home Appliances Sales and Service sector, earning DIIPT recognition from the Indian government in 2022.
            </Text>
            
            {/* Social Icons */}
            <View className="flex flex-row space-x-4 mt-2">
              {/* Facebook */}
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.facebook.com/chiltelindia/')}
                className="rounded-full items-center justify-center border border-gray-300 shadow-sm"
                style={{ width: buttonSize, height: buttonSize }}
              >
                <Image
                  source={require('@/assets/icons/facebook.png')}
                  style={{ width: iconSize, height: iconSize }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Instagram */}
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.instagram.com/chiltelindiapvtltd/')}
                className="rounded-full items-center justify-center border border-gray-300 shadow-sm"
                style={{ width: buttonSize, height: buttonSize }}
              >
                <Image
                  source={require('@/assets/icons/instagram.jpeg')}
                  style={{ width: iconSize, height: iconSize }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* LinkedIn */}
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.linkedin.com/company/105363816')}
                className="rounded-full items-center justify-center border border-gray-300 shadow-sm"
                style={{ width: buttonSize, height: buttonSize }}
              >
                <Image
                  source={require('@/assets/icons/linkedin.png')}
                  style={{ width: iconSize, height: iconSize }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Links */}
          <View className="flex-1">
            <Text className="font-bold text-gray-900 mb-4" style={{ fontSize: headingFontSize }}>
              Quick Links
            </Text>
            {[ 
              { title: 'Home', link: '/' },
              { title: 'About', link: '/about' },
              { title: 'Chill Mart', link: '/collection' },
              { title: 'Contact Us', link: '/contact' },
              { title: 'Blog', link: '/blog' }
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(item.link)}
                className="py-1.5"
              >
                <Text className="text-sm text-gray-700" style={{ fontSize: textFontSize }}>
                  • {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact */}
          <View className="flex-1">
            <Text className="font-bold text-gray-900 mb-4" style={{ fontSize: headingFontSize }}>
              Contacts
            </Text>

            <View className="flex flex-row items-start gap-2">
              <Text className="text-blue-500 mt-1">🏠</Text>
              <Text className="text-sm text-gray-700 leading-relaxed flex-1" style={{ fontSize: textFontSize }}>
                Shristi Apartment, Flat No - 1 D/2, Nowbhanga, SEC-IV, North 24 Parganas, Kolkata - 700105
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2 mt-3">
              <Text className="text-blue-500">📧</Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:info@chiltel.com')}>
                <Text className="text-sm text-gray-700 underline" style={{ fontSize: textFontSize }}>
                  info@chiltel.com
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 space-y-2">
              <TouchableOpacity
                className="py-1"
                onPress={() => Linking.openURL('https://seller.chiltel.com/')}
              >
                <Text className="text-sm text-gray-700" style={{ fontSize: textFontSize }}>
                  👤 Register as Seller
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-1"
                onPress={() => Linking.openURL('https://partner.chiltel.com/')}
              >
                <Text className="text-sm text-gray-700" style={{ fontSize: textFontSize }}>
                  👥 Register as Service Partner
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Bottom Bar */}
        <View className="border-t border-gray-200 mt-8 pt-4 items-center">
          <Text className="text-gray-500 text-center text-xs leading-5" style={{ fontSize: smallTextFontSize }}>
            © 2024 Chiltel India Private Limited. All rights reserved.
            {'\n'}CIN: U52100WB2021PTC250206
          </Text>
          <Text className="text-gray-500 text-xs mt-2" style={{ fontSize: smallTextFontSize }}>
            🇮🇳 Made in India with Love
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Footer;
