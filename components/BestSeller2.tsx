import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { router, useNavigation } from "expo-router";

type ImageKey =
  | "deep_freeze"
  | "visi_cooler"
  | "cassette_ac"
  | "water_cooler"
  | "water_dispenser"
  | "display_counter";

// Centralized image import similar to LatestCollection
const images: Record<string, any> = {
  deep_freeze: require("@/assets/air_conditioner.jpeg"),
  visi_cooler: require("@/assets/water_purifier.jpeg"),
  cassette_ac: require("@/assets/geyser.jpeg"),
  water_cooler: require("@/assets/microwave.jpeg"),
  water_dispenser: require("@/assets/refrigerator.jpeg"),
  display_counter: require("@/assets/washing_machine.jpeg"),
};

interface Category {
  name: string;
  icon: string;
  imageKey: string;
  description: string;
  url: string;
}

const BestSeller2 = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const categories: Category[] = [
    {
      name: "Deep Freezer",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      imageKey: "deep_freeze",
      description: "High-quality deep freezers for your storage needs.",
      url: "/collection/deep-freezer",
    },
    {
      name: "Visi Cooler",
      icon:
        "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      imageKey: "visi_cooler",
      description: "Reliable visi coolers for commercial use.",
      url: "/collection/visi-cooler",
    },
    {
      name: "Cassette AC",
      icon:
        "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      imageKey: "cassette_ac",
      description: "Efficient cooling with cassette air conditioners.",
      url: "/collection/cassette-ac",
    },
    {
      name: "Water Cooler Cum Purifier",
      icon:
        "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      imageKey: "water_cooler",
      description: "Dual-function water cooler and purifier.",
      url: "/collection/water-cooler-purifier",
    },
    {
      name: "Water Dispenser",
      icon:
        "M7 2v11m0 0a2 2 0 104 0m-4 0a2 2 0 114 0m5-11v11m0 0a2 2 0 104 0m-4 0a2 2 0 114 0",
      imageKey: "water_dispenser",
      description: "Convenient and portable water dispensers.",
      url: "/collection/water-dispenser",
    },
    {
      name: "Display Counter",
      icon:
        "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4",
      imageKey: "display_counter",
      description: "Attractive display counters for showcasing products.",
      url: "/collection/display-counter",
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

  const handlePurchase = (url: string) => {
    router.push(url as any);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Heading Section */}
      <View className="items-center mt-6 mb-4 px-4">
        <Text className="text-2xl font-bold text-center text-gray-900">
          <Text className="text-gray-600">RETAIL</Text>{" "}
          <Text className="text-gray-900">APPLIANCES</Text>
        </Text>
        <View className="w-16 h-1 bg-blue-500 my-2" />
        <Text className="text-gray-500 text-center">
          Discover a wide range of retail appliances available for booking.
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
                    source={images[category.imageKey as ImageKey]}
                    className="w-full h-full"
                    resizeMode="cover"
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
                    className="bg-blue-500 py-4 px-6 rounded-lg items-center transition-all duration-200 hover:bg-blue-600"
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

export default BestSeller2;