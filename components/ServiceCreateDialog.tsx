import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CheckCircle, X } from "lucide-react-native"; // using lucide-react-native for icons
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // import RootStackParamList

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ServiceRequestDialogProps {
  visible: boolean;
  onClose: () => void;
}

const ServiceRequestDialog: React.FC<ServiceRequestDialogProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp>(); 

  // const navigateToOrders = () => {
  //   onClose();
  //   navigation.navigate("Orders"); // assumes 'Orders' exists in RootStackParamList
  // };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <View className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-3 right-3 p-1"
            accessibilityLabel="Close"
          >
            <X size={24} color="#9ca3af" />
          </TouchableOpacity>

          {/* Tick Icon */}
          <View className="items-center mb-4 mt-2">
            <CheckCircle size={80} color="#22c55e" />
          </View>

          {/* Confirmation Text */}
          <Text className="text-xl font-semibold text-center mb-6 text-gray-800">
            Service Request Created
          </Text>

          {/* View Orders Button */}
          {/* <TouchableOpacity
            onPress={navigateToOrders}
            className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium text-base">
              View Orders
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default ServiceRequestDialog;