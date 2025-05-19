import React from "react";
import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { AuthProvider } from '@/context/AuthContext';
import ShopContextProvider from '@/context/ShopContext';
import { ServiceCartProvider } from '@/context/ServiceCartContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ShopContextProvider>
        <ServiceCartProvider>
          <CartProvider>
            <StatusBar hidden={true} />
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </CartProvider>
        </ServiceCartProvider>
      </ShopContextProvider>
    </AuthProvider>
  );
}