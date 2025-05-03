import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';

interface Category {
  name: string;
  icon: string;
  image: string;
  description: string;
  url: string;
}

type ImageKey =
  | "water_cooler"
  | "upright_chiller"
  | "geyser"
  | "microwave"
  | "refrigerator"
  | "washing_machine"
  | "ucounter"
  | "bbchiler"
  | "fprep"
  | "icube";

const images: Record<ImageKey, any> = {
  water_cooler: require("@/assets/water_cooler.jpeg"),
  upright_chiller: require("@/assets/microwave.jpeg"),
  geyser: require("@/assets/geyser.jpeg"),
  microwave: require("@/assets/microwave.jpeg"),
  refrigerator: require("@/assets/refrigerator.jpeg"),
  washing_machine: require("@/assets/washing_machine.jpeg"),
  ucounter: require("@/assets/under_counter.jpeg"),
  bbchiler: require("@/assets/back_bar_chiller.jpeg"),
  fprep: require("@/assets/food_prep_chiller.jpeg"),
  icube: require("@/assets/ice_maker.jpeg"),
};

const BestSeller: React.FC = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const categories: Category[] = [
    {
      name: "Water Cooler",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      image: "water_cooler",
      description: "Commercial water cooler for professional use",
      url: "/chillMart",
    },
    {
      name: "Upright Chiller",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547",
      image: "upright_chiller",
      description: "Professional upright chiller for commercial use",
      url: "/chillMart",
    },
    {
      name: "Under Counter",
      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      image: "ucounter",
      description: "Space-saving under counter chiller",
      url: "/chillMart",
    },
    {
      name: "Back Bar Chiller",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      image: "bbchiler",
      description: "Efficient back bar chiller for beverages",
      url: "/chillMart",
    },
    {
      name: "Food Prep Chiller",
      icon: "M7 2v11m0 0a2 2 0 104 0m-4 0a2 2 0 114 0m5-11v11m0 0a2 2 0 104 0m-4 0a2 2 0 114 0",
      image: "fprep",
      description: "Food preparation chiller for professional kitchens",
      url: "/chillMart",
    },
    {
      name: "Ice Cube",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4",
      image: "icube",
      description: "Commercial ice cube maker",
      url: "/chillMart",
    },
  ]; 

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index % categories.length);
  };
  
  const scrollToCard = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  };
  
  const handlePurchase = (url: any) => {
    router.push(url);
  };
  
  return (
    <View className="flex-1 bg-gray-50">
      {/* Heading Section */}
      <View className="items-center mt-6 mb-4 px-4">
        <Text className="text-2xl font-bold text-center text-gray-900">
          <Text className="text-gray-600">KITCHEN</Text>{" "}
          <Text className="text-gray-900">APPLIANCES</Text>
        </Text>
        <View className="w-16 h-1 bg-blue-500 my-2" />
        <Text className="text-gray-500 text-center">
          Professional kitchen equipment for commercial and industrial use.
        </Text>
      </View>

      {/* Carousel Section */}
      <View className="bg-gray-100 pt-6">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
        >
          {categories.map((category, i) => (
            <View 
              style={{ width: screenWidth }} 
              className="px-4"
            >
              <View className="bg-white rounded-xl shadow-lg overflow-hidden mb-1">
                <TouchableOpacity onPress={() => handlePurchase(category.url)} className="h-60 relative">
                  <Image
                    source={images[category.image as ImageKey]}
                    className="w-full h-full"
                    resizeMode="contain"
                    defaultSource={{ uri: "https://via.placeholder.com/300" }}
                  />
                </TouchableOpacity> 

                <View className="p-4">
                  <Text className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handlePurchase(category.url)}
                    className="bg-blue-500 py-3 px-6 rounded-lg items-center transition-all duration-200 hover:bg-blue-600"
                  >
                    <Text className="text-white text-base font-medium">Service Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-2">
          {categories.map((_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              onPress={() => scrollToCard(index)}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentIndex % categories.length ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default BestSeller;