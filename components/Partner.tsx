import React from "react";
import { View, Text, Image, Animated, ScrollView } from "react-native";

const Partner: React.FC = () => {
  const partnerLogos = [
    { name: "Samsung", src: require("../assets/samsung.png") },
    { name: "Daikin", src: require("../assets/daikin.jpeg") },
    { name: "Blue Star", src: require("../assets/bluestar.jpeg") },
    { name: "Godrej", src: require("../assets/godrej.jpeg") },
    { name: "Electrolux", src: require("../assets/electrolux.jpeg") },
    { name: "Haier", src: require("../assets/haier.jpeg") },
    { name: "Panasonic", src: require("../assets/panasonic.jpeg") },
    { name: "Voltas", src: require("../assets/voltas.jpg") },
    { name: "Whirlpool", src: require("../assets/whirphool.png") },
    { name: "LG", src: require("../assets/lg.png") },
    { name: "Carrier", src: require("../assets/carrier.png") },
  ];

  const scrollAnim = new Animated.Value(0); // For scrolling animation

  const animateScroll = () => {
    scrollAnim.setValue(0); // Reset animation
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();
  };

  // Handle the logo movement for the scrolling animation
  const scrollInterpolate = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1000], // Change the number to adjust the speed of scroll
  });

  React.useEffect(() => {
    animateScroll();
  }, []);

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center py-8">
      <View className="items-center mb-6">
        <Text className="text-4xl font-bold text-gray-900">
          <Text className="text-gray-500">PART</Text>
          <Text className="text-gray-900">NERS</Text>
        </Text>
        <View className="w-16 h-1 bg-blue-500 mt-2 mb-4"></View>
        <Text className="text-center text-gray-600 text-base">
          Together with our Partners, Delivering Excellence.
        </Text>
      </View>

      {/* Upper scrolling row */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Animated.View style={{ flexDirection: "row", transform: [{ translateX: scrollInterpolate }] }}>
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <Image
              // key={`upper-${index}`}
              source={logo.src}
              className="w-24 h-24 mx-4"
              accessible={true}
              accessibilityLabel={`${logo.name} logo`}
            />
          ))}
        </Animated.View>
      </ScrollView>

      {/* Lower scrolling row */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4">
        <Animated.View
          style={{
            flexDirection: "row",
            transform: [{ translateX: scrollInterpolate }],
          }}
        >
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <Image
              // key={`lower-${index}`}
              source={logo.src}
              className="w-24 h-24 mx-4"
              accessible={true}
              accessibilityLabel={`${logo.name} logo`}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Partner;
