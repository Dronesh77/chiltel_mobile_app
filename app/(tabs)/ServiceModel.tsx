import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import axios from 'axios';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import AuthContext from '@/context/AuthContext';
import { ShopContext, useShop } from '@/context/ShopContext';
import ServiceCartContext, { useServiceCart } from '@/context/ServiceCartContext';
import ModalLoader from '@/components/ModalLoader';
// import PdfViewerWindow from './PdfViewer';
import { useAuth } from '@/context/AuthContext';

type ServiceModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onBook: () => void;
  category: {
    name: string;
  } | null;
};

type Service = {
  _id: string;
  name: string;
  price: number;
  duration: string;
  rateChart?: string;
  description: string;
  type: string;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

const ServiceModal: React.FC<ServiceModalProps> = ({ isVisible, onClose, onBook, category }) => {
  if (!isVisible) return null;

  const { user, isAuthenticated, sessionId } = useAuth();
  const { backendUrl } = useShop();
  const { addToServiceCart } = useServiceCart();;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const today = new Date();
  const [services, setServices] = useState<Record<string, Record<string, Service[]>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [servicesLoading, setServicesLoading] = useState<boolean>(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [scheduleService, setScheduleService] = useState<{services: {serviceId: string, count: number, price: number}[]} | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>(today.toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [acMode, setAcMode] = useState<string>("Split AC");
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({});
  const [rateChartModalOpen, setRateChartModalOpen] = useState<boolean>(false);
  const [ratechart, setRatechart] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const toggleAcMode = () => {
    setAcMode((prevMode) => prevMode === "Split AC" ? "Window AC" : "Split AC");
  };

  const fetchStateByPincode = async (pincode: string) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === "Success") {
        return data[0].PostOffice[0].State;
      }
      return null;
    } catch (error) {
      console.error("Error fetching state:", error);
      return null;
    }
  };

  const handleZipCodeChange = async (zipCode: string) => {
    setAddress((prev) => ({ ...prev, zipCode }));
    if (zipCode.length === 6) {
      const state = await fetchStateByPincode(zipCode);
      setAddress((prev) => ({ ...prev, state: state || "" }));
    }
  };

  const fetchAndOrganizeServices = async () => {
    setServicesLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/services/only`, {
        headers: {
          Authorization: sessionId,
          product: category?.name,
        },
      });
      
      if (response.data.success) {
        const rawData = response.data.data;
        const organizedServices: Record<string, Record<string, Service[]>> = {};
        
        rawData.forEach((item: any) => {
          if (!organizedServices[item.product]) {
            organizedServices[item.product] = {};
          }
          if (!organizedServices[item.product][item.category]) {
            organizedServices[item.product][item.category] = [];
          }
          organizedServices[item.product][item.category].push({
            _id: item._id,
            name: item.name,
            price: item.price,
            duration: item.estimatedDuration,
            rateChart: item?.rateChart,
            description: item.description,
            type: item.type,
          });
        });
        
        setServices(organizedServices);
      } else {
        console.error("Error fetching services:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchAndOrganizeServices();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const convertTo24HourFormat = (time12hr: string) => {
    const [time, modifier] = time12hr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const incrementServiceCount = (serviceId: string) => {
    setServiceCounts((prevCounts) => ({
      ...prevCounts,
      [serviceId]: (prevCounts[serviceId] || 0) + 1,
    }));
  };

  const decrementServiceCount = (serviceId: string) => {
    setServiceCounts((prevCounts) => ({
      ...prevCounts,
      [serviceId]: Math.max((prevCounts[serviceId] || 0) - 1, 0),
    }));
  };

  const handleScheduleAllClick = () => {
    const servicesToSchedule = Object.entries(serviceCounts)
      .filter(([_, count]) => count > 0)
      .map(([serviceId, count]) => {
        const service = Object.values(services)
          .flatMap((product) => Object.values(product))
          .flat()
          .find((s) => s._id === serviceId);
          
        return {
          serviceId,
          count,
          price: service?.price || 0,
        };
      });

    if (servicesToSchedule.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one service',
      });
      return;
    }

    setScheduleService({ services: servicesToSchedule });
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      Toast.show({
        type: 'error',
        text1: 'Please login to continue',
      });
      navigation.navigate('Login');
      return;
    }

    if (!selectedDay || !selectedTime) {
      Toast.show({
        type: 'error',
        text1: 'Please select both date and time',
      });
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      Toast.show({
        type: 'error',
        text1: 'Please fill out all address fields',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Initiating Payment',
    });

    try {
      const totalPrice = scheduleService?.services.reduce(
        (sum, service) => sum + service.price * service.count, 0
      ) || 0;

      let orderData = {
        user: user?.id,
        orderType: "service",
        products: [],
        services: [],
        totalAmount: (totalPrice * 1.18).toFixed(2),
        status: "ORDERED",
        paymentDetails: {
          method: "Razorpay",
          transactionId: "",
          paidAt: new Date(),
        },
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const responseRazorpay = await axios.post(
        `${backendUrl}/api/order/razorpay`,
        orderData,
        {
          headers: { Authorization: sessionId }
        }
      );

      if (responseRazorpay.data.success) {
        // Implement Razorpay for React Native
        // This would require a native module integration
        // For this example, we'll simulate a successful payment
        handleScheduleConfirm("simulated_payment_id");
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Payment failed',
      });
    }
  };

  const handleScheduleConfirm = async (paymentId: string) => {
    try {
      const time24hr = selectedTime;
      const scheduledDateTime = new Date(`${selectedDay}T${time24hr}:00`).toISOString();
      
      const totalPrice = scheduleService?.services.reduce(
        (sum, service) => sum + service.price * service.count, 0
      ) || 0;

      const serviceRequest = {
        user: user?.id,
        services: scheduleService?.services || [],
        userLocation: {
          type: "Point",
          coordinates: [0.0, 0.0],
          address: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
        },
        scheduledFor: scheduledDateTime,
        remarks,
        totalPrice,
        paymentId,
      };

      await addToServiceCart(scheduleService?.services || [], serviceRequest);
      onBook();
      
      Toast.show({
        type: 'success',
        text1: 'Service scheduled successfully',
      });
    } catch (err) {
      console.error("Error scheduling service:", err);
      Toast.show({
        type: 'error',
        text1: 'An error occurred while scheduling the service',
      });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setSelectedDay(formattedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
      setSelectedTime(formattedTime);
    }
  };

  const renderServiceCard = (service: Service, categoryName: string, productName: string) => {
    const serviceCount = serviceCounts[service._id] || 0;
    
    if (productName.includes("Air Conditioner")) {
      if (!service.type?.includes(acMode)) {
        return null;
      }
    }

    return (
      <View 
        // key={service._id} 
        className="bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{service.name}</Text>
            <Text className="text-sm text-gray-600 mt-1">{service.description}</Text>
            
            <View className="flex-row items-center mt-2">
              <Clock size={16} color="#6B7280" />
              <Text className="ml-1 text-gray-600">{service.duration || "30 mins"}</Text>
            </View>
            
            <Text className="text-lg font-bold text-blue-600 mt-2">₹{service.price}</Text>
          </View>
          
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => decrementServiceCount(service._id)}
              className="bg-gray-200 rounded-full w-8 h-8 justify-center items-center"
            >
              <Text className="text-xl font-bold text-gray-700">-</Text>
            </TouchableOpacity>
            
            <Text className="mx-3 text-lg font-bold">{serviceCount}</Text>
            
            <TouchableOpacity
              onPress={() => incrementServiceCount(service._id)}
              className="bg-blue-500 rounded-full w-8 h-8 justify-center items-center"
            >
              <Text className="text-xl font-bold text-white">+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {service.rateChart && (
          <TouchableOpacity
            onPress={() => {
              setRatechart(service.rateChart);
              setRateChartModalOpen(true);
            }}
            className="mt-3 bg-gray-100 py-2 px-4 rounded-md"
          >
            <Text className="text-blue-600 font-medium text-center">View Rate Chart</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Calculate total price and services
  const totalPrice = scheduleService?.services.reduce(
    (sum, service) => sum + service.price * service.count, 0
  ) || 0;
  
  const totalServices = scheduleService?.services.reduce(
    (sum, service) => sum + service.count, 0
  ) || 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-gray-100">
          {/* Header */}
          <View className="bg-blue-600 p-4 flex-row justify-between items-center">
            <Text className="text-xl font-bold text-white">Book a Service</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-white font-bold text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {servicesLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="mt-4 text-lg font-semibold text-gray-600">
                Loading services...
              </Text>
            </View>
          ) : scheduleService ? (
            <ScrollView className="flex-1 p-4">
              <View className="bg-white rounded-lg shadow-md p-4 mb-4">
                <Text className="text-xl font-bold text-gray-800 mb-4">Schedule Service</Text>
                
                {/* Date Picker */}
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Select Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="border border-gray-300 rounded-md p-3 bg-white"
                  >
                    <Text>{selectedDay || "Select a date"}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(selectedDay || today)}
                      mode="date"
                      display="default"
                      minimumDate={today}
                      onChange={handleDateChange}
                    />
                  )}
                </View>
                
                {/* Time Picker */}
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Select Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    className="border border-gray-300 rounded-md p-3 bg-white"
                  >
                    <Text>{selectedTime || "Select a time"}</Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </View>
                
                {/* Address Fields */}
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Street Address</Text>
                  <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    value={address.street}
                    onChangeText={(text) => setAddress(prev => ({ ...prev, street: text }))}
                    placeholder="Enter your street address"
                  />
                </View>
                
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">City</Text>
                  <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    value={address.city}
                    onChangeText={(text) => setAddress(prev => ({ ...prev, city: text }))}
                    placeholder="Enter your city"
                  />
                </View>
                
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">PIN Code</Text>
                  <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    value={address.zipCode}
                    onChangeText={handleZipCodeChange}
                    placeholder="Enter your PIN code"
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
                
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">State</Text>
                  <Text className="border border-gray-300 rounded-md p-3 bg-gray-100">
                    {address.state || "Enter a valid PIN code to auto-fill"}
                  </Text>
                </View>
                
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Remarks (Optional)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    value={remarks}
                    onChangeText={setRemarks}
                    placeholder="Any special instructions"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                
                {/* Order Summary */}
                <View className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Text className="text-lg font-bold text-gray-800 mb-2">Order Summary</Text>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Total Services:</Text>
                    <Text className="font-bold">{totalServices}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Subtotal:</Text>
                    <Text className="font-bold">₹{totalPrice.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">GST (18%):</Text>
                    <Text className="font-bold">₹{(totalPrice * 0.18).toFixed(2)}</Text>
                  </View>
                  <View className="h-px bg-gray-300 my-2" />
                  <View className="flex-row justify-between">
                    <Text className="text-gray-800 font-bold">Total:</Text>
                    <Text className="text-blue-600 font-bold text-lg">₹{(totalPrice * 1.18).toFixed(2)}</Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={handlePayment}
                  className="bg-blue-600 py-3 px-4 rounded-lg"
                >
                  <Text className="text-white font-bold text-center text-lg">Proceed to Payment</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setScheduleService(null)}
                  className="mt-3 py-3 px-4 rounded-lg border border-gray-300"
                >
                  <Text className="text-gray-700 font-bold text-center">Back to Services</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <ScrollView className="flex-1">
              {/* AC Mode Toggle for Air Conditioner */}
              {category?.name.includes("Air Conditioner") && (
                <View className="bg-white p-4 mb-2 flex-row justify-between items-center">
                  <Text className="text-lg font-semibold">AC Type:</Text>
                  <View className="flex-row bg-gray-200 rounded-lg overflow-hidden">
                    <TouchableOpacity
                      onPress={toggleAcMode}
                      className={`py-2 px-4 ${acMode === "Split AC" ? "bg-blue-600" : "bg-gray-200"}`}
                    >
                      <Text className={`font-medium ${acMode === "Split AC" ? "text-white" : "text-gray-700"}`}>
                        Split AC
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={toggleAcMode}
                      className={`py-2 px-4 ${acMode === "Window AC" ? "bg-blue-600" : "bg-gray-200"}`}
                    >
                      <Text className={`font-medium ${acMode === "Window AC" ? "text-white" : "text-gray-700"}`}>
                        Window AC
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {/* Service Categories */}
              {Object.entries(services).map(([productName, categories]) => (
                <View 
                  // key={productName} 
                  className="mb-4"
                >
                  {Object.entries(categories).map(([categoryName, serviceList]) => (
                    <View 
                      // key={categoryName} 
                      className="mb-2"
                    >
                      <TouchableOpacity
                        onPress={() => setExpandedCategory(expandedCategory === categoryName ? null : categoryName)}
                        className="bg-white p-4 flex-row justify-between items-center"
                      >
                        <Text className="text-lg font-bold text-gray-800">{categoryName}</Text>
                        {expandedCategory === categoryName ? (
                          <ChevronUp size={24} color="#4B5563" />
                        ) : (
                          <ChevronDown size={24} color="#4B5563" />
                        )}
                      </TouchableOpacity>
                      
                      {expandedCategory === categoryName && (
                        <View className="p-4 bg-gray-50">
                          {serviceList.map((service) => renderServiceCard(service, categoryName, productName))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ))}
              
              {/* Schedule Button */}
              <View className="p-4">
                <TouchableOpacity
                  onPress={handleScheduleAllClick}
                  className="bg-blue-600 py-3 px-4 rounded-lg mb-6"
                >
                  <Text className="text-white font-bold text-center text-lg">Schedule Selected Services</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
          
          {/* Rate Chart Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={rateChartModalOpen}
            onRequestClose={() => setRateChartModalOpen(false)}
          >
            <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
              <View className="bg-white rounded-lg w-full max-h-[80%] p-4">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold">Rate Chart</Text>
                  <TouchableOpacity onPress={() => setRateChartModalOpen(false)}>
                    <Text className="text-2xl">✕</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView className="flex-1">
                  {ratechart && typeof ratechart === 'object' ? (
                    <View>
                      {Object.entries(ratechart).map(([key, value]: [string, any]) => (
                        <View 
                          // key={key} 
                          className="mb-4"
                        >
                          <Text className="text-lg font-bold text-gray-800 mb-2">{key}</Text>
                          <View className="bg-gray-100 rounded-lg p-3">
                            {value.map((item: any, index: number) => (
                              <View 
                                // key={index} 
                                className="mb-2 pb-2 border-b border-gray-200"
                              >
                                <Text className="text-gray-700">{item.trim()}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text className="text-center text-gray-600">No rate chart available</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
          
          {/* Loading Overlay */}
          {isLoading && <ModalLoader />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ServiceModal;
