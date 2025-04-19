import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { View, Text, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';
import AuthContext, { useAuth } from "./AuthContext";

// Environment variables
const BACKEND_URL = 'YOUR_BACKEND_URL';

// Define types
interface ServiceRequest {
  _id: string;
  serviceName: string;
  price: number;
  status: string;
  date?: string;
  time?: string;
  userId?: string;
  // Add any other fields your service request has
}

interface User {
  _id: string;
  id: string;
  // Other user properties
}

interface ServiceCartContextType {
  serviceCart: ServiceRequest[];
  serviceCartLoading: boolean;
  addToServiceCart: (scheduleService: any, serviceRequest: any) => Promise<void>;
  updateServiceQuantity: (userId: string, serviceId: string, quantity: number) => Promise<{
    success: boolean;
    updatedServiceCart?: ServiceRequest[];
    error?: string;
  }>;
  removeFromServiceCart: (userId: string, serviceId: string) => Promise<{
    success: boolean;
    updatedServiceCart?: ServiceRequest[];
    error?: string;
  }>;
  setServiceCart: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  fetchServiceCart: () => Promise<void>;
  serviceCartAmount: number;
  serviceCartCount: number;
}

interface ServiceCartProviderProps {
  children: ReactNode;
}

const ServiceCartContext = createContext<ServiceCartContextType | undefined>(undefined);

export const ServiceCartProvider: React.FC<ServiceCartProviderProps> = ({ children }) => {
  const [serviceCart, setServiceCart] = useState<ServiceRequest[]>([]);
  const [serviceCartAmount, setServiceCartAmount] = useState<number>(0);
  const [serviceCartCount, setServiceCartCount] = useState<number>(0);
  const [serviceCartLoading, setServiceCartLoading] = useState<boolean>(false);
  
  // Use the useAuth hook instead of useContext directly to ensure proper typing
  const { isAuthenticated, user, sessionId } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchServiceCart();
    } else {
      setServiceCart([]);
    }
  }, [isAuthenticated, user]);

  // Get auth token from secure storage or context
  const getAuthToken = async (): Promise<string | null> => {
    try {
      // Using session ID from AuthContext
      return sessionId || null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const fetchServiceCart = async (): Promise<void> => {
    if (user) {
      try {
        setServiceCartLoading(true);
        
        // Get token 
        const token = await getAuthToken();
        
        // const response = await axios.get(
        //   `${BACKEND_URL}/api/serviceRequests/user/${user._id ? user._id : user.id}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        const response = await axios.get(BACKEND_URL);
        
        setServiceCart(response.data.data);
        
        // Calculate service cart amount and count if needed
        if (response.data.data && response.data.data.length > 0) {
          // You might need to adjust this calculation based on your data structure
          const totalAmount = response.data.data.reduce(
            (sum: number, service: ServiceRequest) => sum + (service.price || 0), 
            0
          );
          setServiceCartAmount(totalAmount);
          setServiceCartCount(response.data.data.length);
        } else {
          setServiceCartAmount(0);
          setServiceCartCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch service cart:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load your service requests",
        });
      } finally {
        setServiceCartLoading(false);
      }
    }
  };

  const addToServiceCart = async (scheduleService: any, serviceRequest: any): Promise<void> => {
    if (!isAuthenticated) {
      Toast.show({
        type: "info",
        text1: "Authentication Required",
        text2: "Please log in to add this service to your cart.",
      });
    } else {
      try {
        setServiceCartLoading(true);
        
        // Get token
        const token = await getAuthToken();
        
        const response = await axios.post(
          `${BACKEND_URL}/api/serviceRequests/`,
          serviceRequest,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        await fetchServiceCart();
        
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Service request created successfully",
        });
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to create service request",
        });
        console.error("Error while adding service to cart: ", err);
      } finally {
        setServiceCartLoading(false);
      }
    }
  };

  const removeFromServiceCart = async (userId: string, serviceId: string): Promise<{
    success: boolean;
    updatedServiceCart?: ServiceRequest[];
    error?: string;
  }> => {
    try {
      setServiceCartLoading(true);
      const token = await getAuthToken();
      
      const response = await axios.post(
        `${BACKEND_URL}/api/service-cart/remove`,
        { userId, serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        await getServiceCartAmount(userId);
        const updatedCart = response.data.serviceCartData;
        setServiceCart(updatedCart);
        
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Service removed from cart",
        });
        
        return {
          success: true,
          updatedServiceCart: updatedCart,
        };
      } else {
        throw new Error("Failed to remove service from cart");
      }
    } catch (error: any) {
      console.error("Error removing service from cart:", error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove service from cart",
      });
      return { success: false, error: error.message };
    } finally {
      setServiceCartLoading(false);
    }
  };

  const updateServiceQuantity = async (userId: string, serviceId: string, quantity: number): Promise<{
    success: boolean;
    updatedServiceCart?: ServiceRequest[];
    error?: string;
  }> => {
    try {
      setServiceCartLoading(true);
      const token = await getAuthToken();
      
      const response = await axios.post(
        `${BACKEND_URL}/api/service-cart/update`,
        { userId, serviceId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        await getServiceCartAmount(userId);
        const updatedCart = response.data.serviceCart;
        setServiceCart(updatedCart);
        
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Service quantity updated",
        });
        
        return { success: true, updatedServiceCart: updatedCart };
      } else {
        throw new Error("Failed to update service quantity in cart");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update service quantity",
      });
      return { success: false, error: error.message };
    } finally {
      setServiceCartLoading(false);
    }
  };

  const getServiceCartAmount = async (userId: string): Promise<void> => {
    try {
      const token = await getAuthToken();
      
      const response = await axios.post(
        `${BACKEND_URL}/api/service-cart/get`,
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setServiceCartAmount(response.data.serviceCartData.totalAmount);
      
      // Update cart count
      let totalCount = 0;
      const services = response.data.serviceCartData.items;
      for (let item of services) {
        totalCount += item.quantity;
      }
      setServiceCartCount(totalCount);
      
    } catch (error) {
      console.error("Error getting service cart amount:", error);
    }
  };

  // Loading state component with improved styling
  if (serviceCartLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white px-6 py-8 rounded-xl shadow-lg w-4/5 items-center">
          <View className="bg-indigo-50 p-4 rounded-full">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
          <Text className="mt-4 text-xl font-bold text-indigo-600">
            Loading Services
          </Text>
          <Text className="mt-2 text-gray-500 text-center">
            Please wait while we fetch your service requests
          </Text>
        </View>
      </View>
    );
  }

  const value: ServiceCartContextType = {
    serviceCart,
    serviceCartLoading,
    addToServiceCart,
    updateServiceQuantity,
    removeFromServiceCart,
    setServiceCart,
    fetchServiceCart,
    serviceCartAmount,
    serviceCartCount,
  };

  return (
    <ServiceCartContext.Provider value={value}>
      {children}
    </ServiceCartContext.Provider>
  );
};

export const useServiceCart = (): ServiceCartContextType => {
  const context = useContext(ServiceCartContext);
  if (!context) {
    throw new Error("useServiceCart must be used within a ServiceCartProvider");
  }
  return context;
};

export default ServiceCartContext;