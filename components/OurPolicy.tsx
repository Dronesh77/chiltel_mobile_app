import React from "react";
import { Sparkles, ShieldCheck, Clock } from "lucide-react-native";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Policy {
  icon: React.ReactElement;
  title: string;
  description: string;
  colors: readonly [string, string, ...string[]];
}

const OurPolicy: React.FC = () => {
  const policies: Policy[] = [
    {
      icon: <Sparkles size={28} color="#fff" />,
      title: "Price Never Seen",
      description: "Affordable Pricing for Every Need - Products and Services You Can Trust!",
      colors: ["#8B5CF6", "#EC4899"] as const,
    },
    {
      icon: <ShieldCheck size={28} color="#fff" />,
      title: "No Service No Fee",
      description: "30-Day Warranty with Genuine Manufacturer Spares for All Services! Terms and Condition apply.",
      colors: ["#3B82F6", "#06B6D4"] as const,
    },
    {
      icon: <Clock size={28} color="#fff" />,
      title: "Best Customer Support",
      description: "We provide customer support from 9 AM to 6 PM, Monday to Saturday.",
      colors: ["#F59E0B", "#EF4444"] as const,
    },
  ];

  return (
    <View className="bg-white px-4 py-12">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-10">OUR POLICY</Text>
      
      <View className="flex flex-col">
        {policies.map((policy, index) => (
          <LinearGradient
            // key={index}
            colors={policy.colors}
            start={[0, 0]}
            end={[1, 0]}
            style={{ borderRadius: 16, padding: 20, marginBottom: 20 }} // padding and margin between cards
          >
            <View className="flex flex-col">
              <View>{policy.icon}</View>
              <Text className="text-xl font-semibold text-white mb-2">{policy.title}</Text>
              <Text className="text-white text-sm leading-relaxed">{policy.description}</Text>
            </View>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

export default OurPolicy;
