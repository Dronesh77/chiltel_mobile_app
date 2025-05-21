import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import Toast from 'react-native-toast-message';

const CartScreen = () => {
  const router = useRouter();
  const {
    cart,
    cartLoading,
    updateQuantity,
    removeFromCart,
    cartAmount,
  } = useCart();

  const shippingFee = 299;
  const total = cartAmount + shippingFee;

  if (cartLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white px-6 py-8 rounded-xl shadow-lg w-4/5 items-center">
          <View className="bg-indigo-50 p-4 rounded-full">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
          <Text className="mt-4 text-xl font-bold text-indigo-600">Loading Cart</Text>
          <Text className="mt-2 text-gray-500 text-center">Please wait while we fetch your cart items</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 pb-14">
        {/* Cart Header */}
        <View className="my-6 items-center">
          <Text className="text-2xl font-bold text-gray-900 tracking-wide">Your Cart</Text>
          <View className="h-1 w-24 bg-blue-600 mt-2 rounded-full shadow-sm" />
        </View>

        {/* Empty Cart State */}
        {(!cart?.items || cart.items.length === 0) ? (
          <View className="bg-white rounded-lg p-8 items-center justify-center">
            <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
            <Text className="text-xl font-medium text-gray-700 mt-4 mb-2">Your cart is empty</Text>
            <Text className="text-gray-500 mb-6 text-center">Add items to your cart to continue shopping</Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 rounded-lg"
            >
              <Text className="text-white font-medium">Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            <View>
              {cart.items.map((item) => (
                <View
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm relative mb-4"
                >
                  <View className="p-4">
                    <View className="flex-row">
                      {/* Image + Quantity */}
                      <View>
                        <View className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
                          <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                        </View>

                        <View className="flex-row items-center justify-center mt-3">
                          <View className="flex-row items-center border border-gray-300 rounded-lg overflow-hidden">
                            <TouchableOpacity
                              onPress={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-100"
                            >
                              <Text className="text-gray-600 text-base">-</Text>
                            </TouchableOpacity>
                            <Text className="w-8 py-1 text-center bg-white font-medium text-sm">
                              {item.quantity}
                            </Text>
                            <TouchableOpacity
                              onPress={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-100"
                            >
                              <Text className="text-gray-600 text-base">+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {/* Product Details */}
                      <View className="flex-1 ml-4">
                        <Text className="text-gray-900 font-semibold text-lg" numberOfLines={2}>
                          {item.name}
                        </Text>

                        <View className="flex-row items-center mt-1">
                          <Text className="text-gray-500 text-sm">{item.brand || 'Generic'}</Text>
                          <Text className="text-gray-400 mx-1">•</Text>
                          <Text className="text-gray-500 text-sm">{item.category}</Text>
                        </View>

                        <View className="flex-row items-center mt-2">
                          <View className="bg-green-100 px-2 py-0.5 rounded">
                            <Text className="text-green-800 font-medium text-xs">{item.rating || 4.0} ★</Text>
                          </View>
                          <Text className="text-gray-500 text-xs ml-2">{item.reviews || 0} reviews</Text>
                        </View>

                        <View className="mt-3 flex-row items-center">
                          <Text className="text-blue-600 font-bold text-lg">
                            ₹{item.price.toLocaleString()}
                          </Text>
                          {item.discount && item.discount > 0 && (
                            <View className="ml-2">
                              <Text className="text-gray-500 line-through text-xs">
                                ₹{(item.price / (1 - item.discount)).toLocaleString()}
                              </Text>
                              <Text className="text-green-600 text-xs font-medium">
                                {Math.round(item.discount * 100)}% off
                              </Text>
                            </View>
                          )}
                        </View>

                        <View className="mt-2">
                          <Text className={`text-sm font-medium ${item.inStock === false ? 'text-red-500' : 'text-green-600'}`}>
                            {item.inStock === false ? 'Out of Stock' : 'In Stock'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="px-4 py-3 border-t border-gray-200">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="car-outline" size={16} color="#4B5563" />
                      <Text className="text-gray-600 text-xs ml-2">
                        Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-700 text-sm">
                        Total: <Text className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</Text>
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeFromCart(item._id)}
                    className="absolute bottom-4 right-4 bg-red-50 p-3 rounded-full shadow-sm"
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>


            {/* Cart Summary */}
            <View className="bg-white rounded-lg p-5 mt-5 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">PRICE DETAILS</Text>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Price ({cart.items.length} items)</Text>
                  <Text className="text-gray-800">₹{cartAmount.toLocaleString()}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Delivery Charges</Text>
                  <Text className="text-gray-800">₹{shippingFee.toLocaleString()}</Text>
                </View>

                <View className="h-px bg-gray-200 my-2" />

                <View className="flex-row justify-between">
                  <Text className="text-lg font-semibold text-gray-800">Total Amount</Text>
                  <Text className="text-lg font-semibold text-gray-800">₹{total.toLocaleString()}</Text>
                </View>

                <Text className="text-green-600 text-sm mt-1">
                  You will save ₹{(cartAmount * 0.1).toLocaleString()} on this order
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/BuyNow',
                  params: { 
                    isCartOrder: 'true',
                    cartItems: JSON.stringify(cart.items)
                  }
                })}
                className="bg-blue-600 rounded-lg p-4 flex-row justify-center items-center mt-6"
              >
                <Text className="text-white font-semibold text-lg mr-3">PLACE ORDER</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/')}
              className="flex-row items-center justify-center my-6"
            >
              <Ionicons name="arrow-back" size={20} color="#4285f4" />
              <Text className="text-blue-500 text-sm font-semibold ml-2">Continue Shopping</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default CartScreen;
