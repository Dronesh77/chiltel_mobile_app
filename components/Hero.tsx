import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Define interfaces for type safety
interface Category {
  name: string;
  type: string;
  mainCategory: string;
  description: string;
  image: string;
}

interface Stat {
  text: string;
  icon: string;
  end: number;
  color: string;
}

interface Suggestion extends Category {
  resultType: 'purchase' | 'service';
  displayText: string;
  url: string;
}

// Type for navigation
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

// Import category data - assuming this file exports the data with these interfaces
import { allCategories, categoryImageMap, stats } from './categoriesData';
import { Circle } from 'react-native-feather';

// AnimatedCounter component for React Native
interface AnimatedCounterProps {
  end: number;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      setCount(Math.floor(percentage * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <Text className="text-2xl font-bold text-gray-900">{count}</Text>;
};

const Hero: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const screenWidth = Dimensions.get('window').width;

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        const matchingCategories = allCategories.filter(
          (category: Category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Create split results for purchase and service
        const splitResults = matchingCategories.flatMap((category: Category): Suggestion[] => [
          {
            ...category,
            resultType: 'purchase',
            displayText: `${category.name} (Purchase)`,
            url: `products/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
          },
          {
            ...category,
            resultType: 'service',
            displayText: `${category.name} (Service)`,
            url: 'collection',
          },
        ]);

        setSuggestions(splitResults);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close suggestions when user taps outside
  useEffect(() => {
    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      setShowSuggestions(false);
    });

    return () => {
      hideKeyboard.remove();
    };
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion): void => {
    navigation.navigate(suggestion.url);
    setShowSuggestions(false);
    setSearchTerm('');
    Keyboard.dismiss();
  };

  const dismissSuggestions = (): void => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const renderCategoryItem = ({ item }: ListRenderItemInfo<Category>): React.ReactElement => (
    <TouchableOpacity
      className={`${screenWidth < 640 ? 'w-[48%]' : screenWidth < 768 ? 'w-[30%]' : 'w-1/4'} mb-4`}
      onPress={() => navigation.navigate('Collection')}
      activeOpacity={0.7}
    >
      <View className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          source={categoryImageMap[item.image]}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-center mt-2 text-sm font-medium text-gray-700" numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSuggestionItem = ({ item }: ListRenderItemInfo<Suggestion>): React.ReactElement => (
    <TouchableOpacity
      className="flex-row p-3 border-b border-gray-200"
      onPress={() => handleSuggestionClick(item)}
    >
      <View className="flex-row flex-1">
        <View className="w-10 h-10 mr-3 overflow-hidden rounded-md">
          <Image
            source={categoryImageMap[item.image]}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 justify-center">
          <Text className="font-medium text-base text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-400">
            {item.resultType === 'purchase' ? 'Purchase' : 'Service'}
          </Text>
        </View>
      </View>
      <View className="justify-center">
        <Text className="text-xs text-blue-500">{item.type}</Text>
      </View>
    </TouchableOpacity>

  );

  return (
    <TouchableWithoutFeedback onPress={dismissSuggestions}>
      <View className="flex-1 bg-white">
        {/* Header Section */}
        <View className="pt-8 px-4 pb-2">
          <Text className="text-3xl md:text-4xl font-bold text-gray-800">
            Premium Home Appliance <Text className="text-blue-500">Services</Text>
          </Text>
          <Text className="text-base text-gray-500 mt-1.5">
            Sales, repairs, and maintenance by certified technicians
          </Text>
        </View>

        {/* Main Image - Just sized according to device width */}
        <View className="mx-4">
          <Image
            source={require('@/assets/home.webp')}
            className="w-full rounded-md"
            resizeMode="cover"
            style={{
              height: screenWidth, // Adjust the height as needed
              borderRadius: 20, // Adjust the border radius for roundness (increase for more roundness)
            }}
            // resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View className="px-4">
          {/* Search Box - Positioned below the image */}
          <View className="mt-4 mb-6 z-10">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-12">
              <TextInput
                className="flex-1 h-full pl-2 text-base text-gray-700"
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="What are you looking for?"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                className="bg-blue-500 py-2.5 px-4 ml-2 rounded-lg"
                onPress={() => {
                  if (searchTerm.trim() && suggestions.length > 0) {
                    handleSuggestionClick(suggestions[0]);
                  }
                }}
              >
                <Text className="text-white text-base font-medium">Search</Text>
              </TouchableOpacity>
            </View>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <View className="mt-2 bg-white rounded-xl p-3 shadow-md max-h-60">
                <FlatList
                  data={suggestions}
                  renderItem={renderSuggestionItem}
                  keyExtractor={(item) => `${item.name}-${item.resultType}`}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  className="max-h-60"
                />
              </View>
            )}
          </View>

          {/* Categories Grid */}
          <View className="mt-2">
            <FlatList
              data={allCategories.slice(0, 6) as Category[]}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.name}
              numColumns={screenWidth < 640 ? 2 : screenWidth < 768 ? 3 : 4}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>

          {/* Stats */}
          <View className="mt-5 flex-row flex-wrap justify-between">
            {(stats as Stat[]).map((stat, index) => (
              <View 
                // key={index}
                className={`flex-row items-center ${screenWidth < 640 ? 'w-full mb-4' : 'w-[48%] mb-3'}`}
              >
                <View className={`w-12 h-12 rounded-full justify-center items-center mr-3 ${getColorClass(stat.color)}`}>
                  <Ionicons
                    name={getIconByPath(stat.icon) as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={getTextColorByName(stat.color)}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-baseline">
                    <AnimatedCounter end={stat.end} duration={1500} />
                    <Text className="text-2xl font-bold text-gray-900">+</Text>
                  </View>
                  <Text className="text-sm text-gray-400">{stat.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Helper functions to convert web color classes to RN colors
const getColorClass = (colorName: string): string => {
  const colors: Record<string, string> = {
    'blue': 'bg-blue-50',
    'green': 'bg-green-50',
    'yellow': 'bg-yellow-100',
    'red': 'bg-red-100',
    'purple': 'bg-purple-100',
  };
  return colors[colorName] || 'bg-gray-100';
};

const getTextColorByName = (colorName: string): string => {
  const colors: Record<string, string> = {
    'blue': '#3B82F6',
    'green': '#10B981',
    'yellow': '#F59E0B',
    'red': '#EF4444',
    'purple': '#8B5CF6',
  };
  return colors[colorName] || '#374151';
};

const getIconByPath = (icon: string): string => {
  const icons: Record<string, string> = {
    'happy': 'happy',
    'statistics': 'stats-chart',
    'support': 'help-circle',
    'check': 'checkmark-circle',
  };
  return icons[icon] || 'alert-circle';
};

export default Hero;