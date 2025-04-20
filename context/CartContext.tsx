import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";

const BACKEND_URL = 'YOUR_BACKEND_URL';

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
  refreshCart: () => Promise<void>;
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
  
  const { 
    isAuthenticated, 
    sessionId, 
    checkAuthStatus, 
    logout 
  } = useAuth();
  const navigation = useNavigation();

  const handleAuthError = () => {
    logout();
    navigation.navigate("Login" as never);
    Toast.show({
      type: "error",
      text1: "Session Expired",
      text2: "Please login again"
    });
  };

  const fetchCart = async (): Promise<void> => {
    try {
      setCartLoading(true);
      if (!isAuthenticated || !sessionId) return;

      const response = await axios.post(
        `${BACKEND_URL}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );
      
      const cartData = response.data.cartData;
      setCart(cartData);
      setCartId(cartData._id);
      setCartAmount(cartData.totalAmount);
      
      const totalCount = cartData.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity, 0
      );
      setCartCount(totalCount);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAuthError();
      }
      console.error("Failed to fetch cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const refreshCart = async () => {
    await checkAuthStatus();
    await fetchCart();
  };

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

  const addToCart = async (item: any): Promise<void> => {
    try {
      if (!isAuthenticated || !sessionId) {
        navigation.navigate("Login" as never);
        return;
      }

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
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );
      
      const updatedCart = response.data.cart;
      setCart(updatedCart);
      setCartId(updatedCart._id);
      setCartAmount(updatedCart.totalAmount);
      
      const totalCount = updatedCart.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity, 0
      );
      setCartCount(totalCount);
      
      Toast.show({
        type: "success",
        text1: "Item Added",
        text2: "Item added to your cart"
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAuthError();
      }
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${sessionId}` } }
      );

      if (response.status === 200) {
        const cartData = response.data.cartData;
        setCart(cartData);
        setCartId(cartData._id);
        setCartAmount(cartData.totalAmount);
        
        const totalCount = cartData.items.reduce(
          (sum: number, item: CartItem) => sum + item.quantity, 0
        );
        setCartCount(totalCount);
        
        return { success: true, updatedCart: cartData };
      }
      throw new Error("Failed to remove item");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAuthError();
      }
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/update`,
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${sessionId}` } }
      );

      if (response.status === 200) {
        const updatedCart = response.data.cart;
        setCart(updatedCart);
        setCartAmount(updatedCart.totalAmount);
        
        const totalCount = updatedCart.items.reduce(
          (sum: number, item: CartItem) => sum + item.quantity, 0
        );
        setCartCount(totalCount);
        
        return { success: true, updatedCart };
      }
      throw new Error("Failed to update quantity");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAuthError();
      }
      return { success: false, error: error.message };
    }
  };

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
    refreshCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};