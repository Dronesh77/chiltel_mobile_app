import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Hero from "@/components/Hero";
import LatestCollection from '@/components/LatestCollection';
import BestSeller from '@/components/BestSeller';
import BestSeller2 from '@/components/BestSeller2';
// import OurPolicy from '@/components/OurPolicy';
import Partner from '@/components/Partner';

// Type definition for navigation
type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<NavigationProps>();
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg font-semibold text-gray-600">
          Loading amazing deals...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Main content container */}
      <View className="flex-1">
        {/* Don't use ScrollView here as it's already in the layout */}
        <View className="pb-2">
          <Hero />
        </View>

        <View className="pb-2">
          <LatestCollection />
        </View>

        <View className="pb-2">
          <BestSeller />
        </View>

        <View className="pb-2">
          <BestSeller2 />
        </View>

        <View className="pb-2">
          <Partner />
        </View>

        {/* <View className="pb-2">
          <OurPolicy />
        </View> */}
      </View>

      <TouchableOpacity
        onPress={scrollToTop}
        className="absolute bottom-20 right-6 bg-blue-600 w-12 h-12 rounded-full justify-center items-center shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-up" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;