import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { User } from '@/app/types';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  console.log('Profile Screen - User Data:', JSON.stringify(user, null, 2));

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Failed to log out. Please try again.'
      });
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 pt-4 pb-10" contentContainerClassName="pb-8">
        <View className="items-center p-6 bg-white border-b border-gray-200">
          <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-4">
            <Image
              source={require('@/assets/icons/profile-icon.png')}
              className="w-20 h-20 rounded-full"
            />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</Text>
          <Text className="text-base text-gray-500">{user?.phone || 'Phone number not available'}</Text>
        </View>

        <View className="mt-4 bg-white border-t border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 px-4 py-3">Account Settings</Text>
          
          <TouchableOpacity className="py-3 px-4 border-b border-gray-200">
            <Text className="text-base text-gray-700">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 px-4 border-b border-gray-200">
            <Text className="text-base text-gray-700">Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 px-4 border-b border-gray-200">
            <Text className="text-base text-gray-700">Notification Settings</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 bg-white border-t border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 px-4 py-3">Support</Text>
          
          <TouchableOpacity className="py-3 px-4 border-b border-gray-200">
            <Text className="text-base text-gray-700">Help Center</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 px-4 border-b border-gray-200">
            <Text className="text-base text-gray-700">Contact Us</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 px-4 border-b border-gray-200">
            <Text className="text-base text-gray-700">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className="mx-4 mt-4 bg-red-500 p-4 rounded-lg items-center"
          onPress={handleLogout}
        >
          <Text className="text-base font-semibold text-white">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </View>
  );
}