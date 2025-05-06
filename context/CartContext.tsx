import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const BACKEND_URL = process.env.VITE_BACKEND_URL;

interface CartItem {
  _id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  productId: string;
  discount?: number;
  brand?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
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
      if (!isAuthenticated || !sessionId) {
        console.log('Not authenticated or no session ID, skipping cart fetch');
        return;
      }

      console.log('Fetching cart with session:', sessionId);

      const response = await axios.post(
        `${BACKEND_URL}/api/cart/get`,
        {},
        {
          headers: {
            'Authorization': sessionId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Cart response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch cart');
      }

      const cartData = response.data.cartData || response.data.cart;
      console.log('Processed cart data:', cartData);

      if (!cartData) {
        throw new Error('No cart data in response');
      }

      if (!cartData.items || !Array.isArray(cartData.items)) {
        console.error('Invalid cart items structure:', cartData);
        throw new Error('Invalid cart items structure');
      }

      setCart(cartData);
      setCartId(cartData._id);
      setCartAmount(cartData.totalAmount || 0);
      
      const totalCount = cartData.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity, 0
      );
      setCartCount(totalCount);

      console.log('Cart state updated:', {
        cartId: cartData._id,
        itemsCount: cartData.items.length,
        totalAmount: cartData.totalAmount,
        totalCount
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 401) {
          handleAuthError();
        }
      }
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
        console.log('Not authenticated or no session ID');
        router.push('/login');
        return;
      }

      // Detailed logging of the item structure
      console.log('Item received in addToCart:', {
        item,
        hasId: Boolean(item?._id),
        keys: item ? Object.keys(item) : [],
        type: typeof item
      });

      // Check for _id since that's what we have in the Product model
      if (!item || !item._id) {
        console.error('Invalid item structure:', item);
        throw new Error('Invalid item structure: Missing product ID');
      }

      console.log('Making request with session:', sessionId);

      const response = await axios.post(
        `${BACKEND_URL}/api/cart/add`,
        {
          itemId: item._id, // Use _id from the Product model
          price: parseFloat((item.price * (1 - (item.discount || 0))).toFixed(2)),
          name: item.name,
          image: item.thumbnail || item.imageUrls?.[0],
          category: item.category,
          inStock: item.inStock ?? true, // Add inStock property with default true
          brand: item.brand,
          rating: item.rating,
          reviews: item.reviews
        },
        {
          headers: {
            'Authorization': sessionId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Server response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add item to cart');
      }

      // The response might be in response.data.cart or response.data.cartData
      const updatedCart = response.data.cart || response.data.cartData;
      if (!updatedCart) {
        throw new Error('No cart data in response');
      }

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
      console.error("Error adding to cart:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 401) {
          handleAuthError();
        }
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to add item to cart"
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (!isAuthenticated || !sessionId) {
        console.log('Not authenticated or no session ID');
        return { success: false, error: 'Not authenticated' };
      }

      // Find the cart item to get the correct itemId
      const cartItem = cart?.items?.find(item => item._id === itemId);
      if (!cartItem) {
        console.error('Item not found in cart:', itemId);
        return { success: false, error: 'Item not found in cart' };
      }

      // Log the full cart item to debug
      console.log('Cart item found:', cartItem);

      // The backend expects the productId field
      const productId = cartItem.productId;
      console.log('Using productId:', productId);

      if (!productId) {
        console.error('No productId found in cart item:', cartItem);
        return { success: false, error: 'Invalid cart item: missing productId' };
      }

      console.log('Removing item from cart:', { 
        cartItemId: cartItem._id,
        productId,
        fullCartItem: cartItem
      });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/remove`,
        { itemId: productId },
        {
          headers: {
            'Authorization': sessionId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Remove item response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove item');
      }

      const cartData = response.data.cartData || response.data.cart;
      if (!cartData) {
        throw new Error('No cart data in response');
      }

      setCart(cartData);
      setCartId(cartData._id);
      setCartAmount(cartData.totalAmount || 0);
      
      const totalCount = cartData.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity, 0
      );
      setCartCount(totalCount);
      
      return { success: true, updatedCart: cartData };
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 401) {
          handleAuthError();
        }
      }
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    console.log('updateQuantity called with:', { itemId, quantity });
    console.log('Current cart state:', {
      hasCart: Boolean(cart),
      itemsCount: cart?.items?.length,
      items: cart?.items
    });
    
    try {
      console.log('Entering try block');
      
      if (!isAuthenticated || !sessionId) {
        console.log('Not authenticated or no session ID');
        return { success: false, error: 'Not authenticated' };
      }

      if (quantity < 1) {
        console.log('Quantity less than 1, removing item instead');
        // If quantity is less than 1, remove the item instead
        return removeFromCart(itemId);
      }

      // Find the cart item to get the correct itemId
      const cartItem = cart?.items?.find(item => item._id === itemId);
      console.log('Cart item search result:', {
        searchedId: itemId,
        found: Boolean(cartItem),
        cartItem
      });

      if (!cartItem) {
        console.error('Item not found in cart:', itemId);
        return { success: false, error: 'Item not found in cart' };
      }

      // Log the full cart item to debug
      console.log('Cart item found:', cartItem);

      // The backend expects the productId field
      const productId = cartItem.productId;
      console.log('Using productId:', productId);

      if (!productId) {
        console.error('No productId found in cart item:', cartItem);
        return { success: false, error: 'Invalid cart item: missing productId' };
      }

      console.log('Making update request with:', { 
        cartItemId: cartItem._id,
        productId,
        quantity,
        fullCartItem: cartItem
      });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/update`,
        { 
          itemId: productId,
          quantity 
        },
        {
          headers: {
            'Authorization': sessionId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Update quantity response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update quantity');
      }

      const cartData = response.data.cartData || response.data.cart;
      if (!cartData) {
        throw new Error('No cart data in response');
      }

      setCart(cartData);
      setCartId(cartData._id);
      setCartAmount(cartData.totalAmount || 0);
      
      const totalCount = cartData.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity, 0
      );
      setCartCount(totalCount);
      
      return { success: true, updatedCart: cartData };
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 401) {
          handleAuthError();
        }
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