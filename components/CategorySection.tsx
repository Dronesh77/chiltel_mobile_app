import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '@/types';
import ApplianceCard from './ApplianceCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CategorySectionProps {
  title: string;
  description: string;
  products: Product[];
  onServicePress: (product: Product) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  products,
  onServicePress,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');

  const displayedProducts = products.slice(0, 6);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index % displayedProducts.length);
  };

  const scrollToCard = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  };

  return (
    <View className="bg-gray-50">
      {/* Heading Section */}
      <View className="items-center mt-6 mb-4 px-4">
        <Text className="text-2xl font-bold text-center text-gray-900">
          {title}
        </Text>
        <View className="w-16 h-1 bg-blue-500 my-2" />
        <Text className="text-gray-500 text-center">
          {description}
        </Text>
      </View>

      {/* Carousel Section */}
      <View className="bg-gray-100 pt-6">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
        >
          {displayedProducts.map((product, index) => (
            <View 
              key={product._id}
              style={{ 
                width: screenWidth,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View style={{ width: '100%', paddingHorizontal: 16 }} className="bg-white rounded-xl shadow-lg overflow-hidden mb-1">
                <ApplianceCard
                  product={product}
                  onServicePress={() => onServicePress(product)}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View className="flex-row justify-center mt-4 mb-4">
          {displayedProducts.map((_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              onPress={() => scrollToCard(index)}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentIndex % displayedProducts.length ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default CategorySection;
