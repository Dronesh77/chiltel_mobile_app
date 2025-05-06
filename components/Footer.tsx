import { View, Text, Linking, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


const Footer = () => {
  const { width } = useWindowDimensions();

  const iconSize = width * 0.06;
  const buttonSize = width * 0.12;
  const spacing = 10;

  const headingFontSize = Math.max(width * 0.06, 18);
  const textFontSize = Math.max(width * 0.04, 14);
  const smallTextFontSize = Math.max(width * 0.03, 12);

  return (
    <View className="bg-white border-t border-gray-200 pt-6 px-4">
      <ScrollView>
        <View className="flex flex-col gap-8 md:flex-row md:gap-12">

          {/* About Section */}
          <View className="flex-1">
            <Text className="font-bold text-gray-900 mb-4" style={{ fontSize: headingFontSize }}>
              About Company
            </Text>
            <Text className="text-gray-700 leading-relaxed mb-4" style={{ fontSize: textFontSize }}>
              Chiltel India, founded by Mr. Sudarshan Kumar Raut in 2021, is a recognized startup in the Home Appliances Sales and Service sector, earning DIIPT recognition from the Indian government in 2022.
            </Text>

            {/* Professional Social Icons */}
            <View className="flex-row mt-2 gap-3">
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.facebook.com/chiltelindia/')}
                className="rounded-full items-center justify-center bg-[#1877F2] shadow"
                style={{ width: buttonSize, height: buttonSize }}
              >
                <FontAwesome name="facebook-f" size={iconSize} color="#fff" />
              </TouchableOpacity>

              <LinearGradient
                colors={['#feda75', '#d62976', '#962fbf']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/chiltelindiapvtltd/')}>
                  <FontAwesome name="instagram" size={iconSize} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>



              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.linkedin.com/company/105363816')}
                className="rounded-full items-center justify-center bg-[#0A66C2] shadow"
                style={{ width: buttonSize, height: buttonSize }}
              >
                <FontAwesome name="linkedin" size={iconSize} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Section */}
          <View className="flex-1">
            <Text className="font-bold text-gray-900 mb-4" style={{ fontSize: headingFontSize }}>
              Contacts
            </Text>

            <View className="flex-row items-start gap-2">
              <Text className="text-blue-500 mt-1">🏠</Text>
              <Text className="text-gray-700 leading-relaxed flex-1" style={{ fontSize: textFontSize }}>
                Shristi Apartment, Flat No - 1 D/2, Nowbhanga, SEC-IV, North 24 Parganas, Kolkata - 700105
              </Text>
            </View>

            <View className="flex-row items-center gap-2 mt-3">
              <Text className="text-blue-500">📧</Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:info@chiltel.com')}>
                <Text className="text-gray-700 underline" style={{ fontSize: textFontSize }}>
                  info@chiltel.com
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 space-y-2">
              <TouchableOpacity
                className="py-1"
                onPress={() => Linking.openURL('https://seller.chiltel.com/')}
              >
                <Text className="text-gray-700" style={{ fontSize: textFontSize }}>
                  👤 Register as Seller
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-1"
                onPress={() => Linking.openURL('https://partner.chiltel.com/')}
              >
                <Text className="text-gray-700" style={{ fontSize: textFontSize }}>
                  👥 Register as Service Partner
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Bar */}
        <View className="border-t border-gray-200 mt-8 pt-4 items-center" style={{ paddingBottom: 40 }}>
          <Text className="text-gray-500 text-center leading-5" style={{ fontSize: smallTextFontSize }}>
            © 2024 Chiltel India Private Limited. All rights reserved.
            {'\n'}CIN: U52100WB2021PTC250206
          </Text>
          <Text className="text-gray-500 mt-2" style={{ fontSize: smallTextFontSize }}>
            🇮🇳 Made in India with Love
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Footer;
