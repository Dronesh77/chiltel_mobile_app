import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

type ImageKey =
  | "air_conditioner"
  | "water_purifier"
  | "geyser"
  | "microwave"
  | "refrigerator"
  | "washing_machine";

const images: Record<ImageKey, any> = {
  air_conditioner: require("@/assets/air_conditioner.jpeg"),
  water_purifier: require("@/assets/water_purifier.jpeg"),
  geyser: require("@/assets/geyser.jpg"),
  microwave: require("@/assets/microwave.jpeg"),
  refrigerator: require("@/assets/refrigerator.jpeg"),
  washing_machine: require("@/assets/washing_machine.jpeg"),
};

const LatestCollection = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  const categories = [
    {
      name: "Air Conditioner",
      image: "air_conditioner",
      description:
        "Professional AC services including installation, repair, and maintenance",
      url: "/Collection",
    },
    {
      name: "Water Purifier",
      image: "water_purifier",
      description:
        "Expert water purifier installation and maintenance services",
      url: "/Collection",
    },
    {
      name: "Geyser",
      image: "geyser",
      description: "Comprehensive geyser repair and installation services",
      url: "/Collection",
    },
    {
      name: "Microwave",
      image: "microwave",
      description: "Expert microwave repair and maintenance services",
      url: "/Collection",
    },
    {
      name: "Refrigerator",
      image: "refrigerator",
      description: "Professional refrigerator repair and maintenance services",
      url: "/Collection",
    },
    {
      name: "Washing Machine",
      image: "washing_machine",
      description: "Expert washing machine repair and maintenance services",
      url: "/Collection",
    },
  ];

  const handlePurchase = (url: string) => {
    router.push(url as any);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    if (index !== activeIndex && index >= 0 && index < categories.length) {
      setActiveIndex(index);
    }
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
    <View className="flex-1 bg-gray-50">
      <View className="items-center mt-6 mb-4 px-4">
        <Text className="text-2xl font-bold text-center text-gray-900">
          <Text className="text-gray-600">DOMESTIC</Text>{" "}
          <Text className="text-gray-900">APPLIANCES</Text>
        </Text>
        <View className="w-16 h-1 bg-blue-500 my-2" />
        <Text className="text-gray-500 text-center">
          Discover our latest and most popular services tailored to meet your
          needs.
        </Text>
      </View>

      {/* Carousel Wrapper */}
      <View className="bg-gray-500 pt-6">
        <ScrollView
          // ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
        >
          {categories.map((category, i) => (
            <View
              // key={`category-${i}`}
              style={{ width: screenWidth }}
              className="px-4"
            >
              <View className="bg-white rounded-xl shadow-lg overflow-hidden mb-1">
                <TouchableOpacity
                  onPress={() => handlePurchase(category.url)}
                  className="h-60 relative"
                >
                  <Image
                    source={images[category.image as ImageKey]}
                    className="w-full h-full"
                    defaultSource={{ uri: "https://via.placeholder.com/300" }}
                    resizeMode="cover"
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
        <View className="flex-row justify-center mb-6"> {/* Reduced margin */}
          {categories.map((_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              onPress={() => scrollToCard(index)}
              className={`h-2 w-2 rounded-full mx-1 ${
                activeIndex === index ? "bg-blue-600" : "bg-gray-400"
              }`}
            />
          ))}
        </View>
      </View>


      {/* CTA Image Banner */}
      <TouchableOpacity
        onPress={() => router.push("/Collection")}
        className="w-full overflow-hidden rounded-xl my-6 mx-4"
      >
        <Image
          source={require("@/assets/1.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default LatestCollection;
