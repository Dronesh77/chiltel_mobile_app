import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../types'; // Assuming you have a types file

const Contact: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  const navigation = useNavigation<NavigationProp<'Contact'>>();

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Success', 'Your message has been sent. We will get back to you soon!', [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setMessage('');
          },
        },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Contact Us</Text>
        </View>

        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-base font-medium text-gray-700 mb-2">Name</Text>
            <TextInput
              className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-base"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#999"
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-base"
              value={email}
              onChangeText={setEmail}
              placeholder="Your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium text-gray-700 mb-2">Message</Text>
            <TextInput
              className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-base h-32 text-top"
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here"
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            className={`rounded-lg p-4 items-center mt-2 ${
              submitting ? 'bg-blue-300' : 'bg-blue-500'
            }`}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text className="text-white text-base font-semibold">
              {submitting ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Other ways to reach us</Text>
          <Text className="text-sm text-gray-600 mb-2">Email: info@chiltel.com</Text>
          <Text className="text-sm text-gray-600 mb-2">Phone: +1 (123) 456-7890</Text>
          <Text className="text-sm text-gray-600">Address: 123 Main Street, City, Country</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;
