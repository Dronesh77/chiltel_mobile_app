import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../types';
import tw from 'twrnc';

const About: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'About'>>();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow p-4 pb-20 w-full`}>
        <View style={tw`items-center my-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>About Chiltel</Text>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-semibold mb-3 text-gray-700`}>Our Story</Text>
          <Text style={tw`text-base leading-6 text-gray-600`}>
            Welcome to Chiltel. This is the about page for our mobile application.
            Replace this content with your actual about information.
          </Text>
        </View>

        {/* Add more sections as needed */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
