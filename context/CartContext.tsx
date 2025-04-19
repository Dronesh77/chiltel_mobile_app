import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AuthContext, { useAuth } from "./AuthContext";

// Environment variables
const BACKEND_URL = 'YOUR_BACKEND_URL';

// Define types
interface CartItem {
  _id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  userId?: string;
}

interface CartContextType {
  cart: Cart | null;
  cartId: string | null;
  cartLoading: boolean;
  addToCart: (item: any) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ 
    success: boolean, 
    updatedCart?: Cart, 
    error?: string 
  }>;
  removeFromCart: (itemId: string) => Promise<{ 
    success: boolean, 
    updatedCart?: Cart, 
    error?: string 
  }>;
  fetchCart: () => Promise<void>;
  cartAmount: number;
  cartCount: number;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartAmount, setCartAmount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartLoading, setCartLoading] = useState<boolean>(true);
  
  const { isAuthenticated, sessionId } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartCount(0);
      setCartAmount(0);
      setCart(null);
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async (): Promise<void> => {
    try {
      setCartLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: sessionId,
          },
        }
      );
      
      const cartData = response.data.cartData;
      setCart(cartData);
      setCartId(cartData._id);
      setCartAmount(cartData.totalAmount);
      
      let totalCount = 0;
      const products = cartData.items;
      for (let item of products) {
        totalCount += item.quantity;
      }
      setCartCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load your cart. Please try again.",
      });
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (item: any): Promise<void> => {
    if (!isAuthenticated) {
      navigation.navigate("Login" as never);
      Toast.show({
        type: "info",
        text1: "Authentication Required",
        text2: "Please log in to add this item to your cart.",
      });
    } else {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/cart/add`,
          {
            itemId: item._id,
            price: parseFloat((item.price * (1 - item.discount)).toFixed(2)),
            name: item.name,
            image: item.thumbnail,
            category: item.category,
          },
          {
            headers: {
              Authorization: sessionId,
            },
          }
        );
        
        const updatedCart = response.data.cart;
        setCart(updatedCart);
        setCartId(updatedCart._id);
        setCartAmount(updatedCart.totalAmount);
        
        let totalCount = 0;
        const products = updatedCart.items;
        for (let item of products) {
          totalCount += item.quantity;
        }
        setCartCount(totalCount);
        
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Item added to your cart",
        });
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong. Please try again.",
        });
        console.error("Error while adding item to cart: ", err);
      }
    }
  };

  const removeFromCart = async (itemId: string): Promise<{ 
    success: boolean, 
    updatedCart?: Cart, 
    error?: string 
  }> => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: sessionId } }
      );

      if (response.status === 200) {
        const cartData = response.data.cartData;
        setCart(cartData);
        setCartId(cartData._id);
        setCartAmount(cartData.totalAmount);
        
        let totalCount = 0;
        const products = cartData.items;
        for (let item of products) {
          totalCount += item.quantity;
        }
        setCartCount(totalCount);
        
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Item removed from cart",
        });
        
        return { success: true, updatedCart: cartData };
      } else {
        throw new Error("Failed to remove item from cart");
      }
    } catch (error: any) {
      console.error("Error removing item from cart:", error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove item from cart",
      });
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<{ 
    success: boolean, 
    updatedCart?: Cart, 
    error?: string 
  }> => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/update`,
        { itemId, quantity },
        { headers: { Authorization: sessionId } }
      );

      if (response.status === 200) {
        const updatedCart = response.data.cart;
        setCartId(updatedCart._id);
        setCartAmount(updatedCart.totalAmount);
        
        let totalCount = 0;
        const products = updatedCart.items;
        for (let item of products) {
          totalCount += item.quantity;
        }
        setCartCount(totalCount);
        setCart(updatedCart);
        
        return { success: true, updatedCart: updatedCart };
      } else {
        throw new Error("Failed to update cart quantity");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update quantity",
      });
      return { success: false, error: error.message };
    }
  };

  // Cart loading state UI
  if (cartLoading && isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white p-6 rounded-2xl shadow-md">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-lg font-medium text-gray-800 text-center">
            Loading your cart
          </Text>
          <Text className="mt-2 text-sm text-gray-500 text-center">
            Please wait while we fetch your items
          </Text>
        </View>
      </View>
    );
  }

  const value: CartContextType = {
    cart,
    cartId,
    cartLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    cartAmount,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;