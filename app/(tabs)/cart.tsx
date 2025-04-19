import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Voltas Beko 260L Direct Cool Single Door Refrigerator',
      price: 19992,
      quantity: 1,
      image: require('../../assets/voltas.jpg'), // Make sure to add this image to your assets folder
    },
  ]);

  const updateQuantity = (id: string, amount: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 299;
  const total = subtotal + shippingFee;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Header */}
        <View className="my-5 items-center">
          <Text className="text-xl font-semibold text-gray-800">YOUR CART</Text>
          <View className="h-0.5 w-15 bg-blue-500 mt-2" />
        </View>

        {/* Cart Items */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow-lg">
          <View className="flex-row py-3 border-b border-gray-300">
            <Text className="flex-1 text-center font-semibold text-gray-600 text-sm">Product</Text>
            <Text className="flex-1 text-center font-semibold text-gray-600 text-sm">Image</Text>
            <Text className="flex-1 text-center font-semibold text-gray-600 text-sm">Quantity</Text>
            <Text className="flex-1 text-center font-semibold text-gray-600 text-sm">Price</Text>
            <Text className="flex-1 text-center font-semibold text-gray-600 text-sm">Actions</Text>
          </View>

          {cartItems.map((item) => (
            <View 
              // key={item.id} 
              className="flex-row items-center py-4 border-b border-gray-300"
            >
              <View className="flex-2">
                <Text className="text-sm text-gray-800">{item.name}</Text>
              </View>

              <Image source={item.image} className="w-15 h-15 mx-2" />

              <View className="flex-1 flex-row items-center justify-center">
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} className="w-8 h-8 border border-gray-300 rounded-md justify-center items-center">
                  <Text className="text-lg text-gray-800">-</Text>
                </TouchableOpacity>
                <Text className="mx-3 text-lg text-gray-800">{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} className="w-8 h-8 border border-gray-300 rounded-md justify-center items-center">
                  <Text className="text-lg text-gray-800">+</Text>
                </TouchableOpacity>
              </View>

              <Text className="flex-1 text-center text-sm font-semibold text-gray-800">Rs {item.price.toFixed(2)}</Text>

              <TouchableOpacity onPress={() => removeFromCart(item.id)} className="flex-1 items-center">
                <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Cart Totals */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow-lg">
          <Text className="text-lg font-semibold text-gray-800 mb-2">CART TOTALS</Text>
          <View className="h-0.5 w-full bg-gray-300 mb-3" />

          <View className="flex-row justify-between py-3 border-b border-gray-300">
            <Text className="text-sm text-gray-600">Subtotal</Text>
            <Text className="text-sm font-semibold text-gray-800">Rs {subtotal.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between py-3 border-b border-gray-300">
            <Text className="text-sm text-gray-600">Shipping Fee</Text>
            <Text className="text-sm font-semibold text-gray-800">Rs {shippingFee.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between py-3">
            <Text className="text-lg font-semibold text-gray-800">Total</Text>
            <Text className="text-lg font-semibold text-gray-800">Rs {total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity className="bg-blue-500 rounded-md p-4 flex-row justify-center items-center mt-4">
            <Text className="text-white font-semibold text-lg mr-3">PROCEED TO CHECKOUT</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Continue Shopping Button */}
        <TouchableOpacity className="flex-row items-center mb-10">
          <Ionicons name="arrow-back" size={20} color="#4285f4" />
          <Text className="text-blue-500 text-sm font-semibold ml-2">Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
