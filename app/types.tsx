import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define all the screens in your app
export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Blog: undefined;
  BlogPost: { id: string };
  Cart: undefined;
  Contact: undefined;
  Product: { productId: string };
  Login: undefined;
  PlaceOrder: undefined;
  BuyNow: undefined;
  Orders: undefined;
  OrderSuccess: { orderId: string };
  Verify: { token: string };
  ServiceCollection: undefined;
  ServiceDetail: { id: string };
  ProductList: { category: string };
  NotFound: undefined;
};


// Navigation prop type that can be used throughout the app
export type NavigationProp<T extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, T>;

// Route prop type for accessing route parameters
export type RouteProps<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

// Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  discountPrice?: number;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  image?: string;
}

// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// User interface
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

// Order interface
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: 'card' | 'paypal' | 'cod';
}

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
  tags?: string[];
}

// Service interface
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: string;
}

// Form error type
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}