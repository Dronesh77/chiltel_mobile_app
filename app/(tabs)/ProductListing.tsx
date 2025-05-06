import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput
} from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 32) / 2;

// Product interface
interface Product {
  _id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  discount: number;
  inStock: number;
  availability: boolean;
  category: string;
  mainCategory: string;
  type: string;
  rating: number;
  reviews: number;
  imageUrls: string[];
  thumbnail: string;
  features: string[];
  specifications: Record<string, string>;
  description?: string;
  requestedStatus: string;
  createdAt: string;
  _v?: number;
}

// Price range options
const priceRanges = [
  { label: "Under ₹15,000", min: 0, max: 15000 },
  { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
  { label: "Above ₹50,000", min: 50000, max: Infinity },
];

const ProductListing = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Add default value for category if params is undefined
  console.log('Route params:', category);
  const categoryParam = category || 'All Products';
  console.log('Using category:', categoryParam);
  
  const [loading, setLoading] = useState(true);  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");

  const backendUrl = process.env.BACKEND_URL;
  
  // Filter state
  const [filters, setFilters] = useState({
    brand: [] as string[],
    priceRange: [] as { label: string; min: number; max: number }[],
    rating: null as number | null,
  });

  useEffect(() => {
    fetchProducts();
  }, [categoryParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products for category:', categoryParam);
      
      // First try to fetch all products
      const response = await axios.get(backendUrl + "/api/product/list", 
        {
          params: {
            category: categoryParam
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // console.log('API Response:', response.data);
      
      // Check if response has data property and it's an array
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        console.error('Invalid API response format:', response.data);
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      const allData = response.data.data;
      
      // Log unique main categories
      const uniqueMainCategories = [...new Set(allData.map((product: Product) => product.mainCategory))];
      console.log('Unique main categories:', uniqueMainCategories);
      
      console.log('Total products fetched:', allData.length);

      // If category is not 'All Products', filter on client side
      if (categoryParam !== 'All Products') {
        const filteredData = allData.filter((product: Product) => 
          product.category?.toLowerCase() === categoryParam.toLowerCase() || 
          product.mainCategory?.toLowerCase() === categoryParam.toLowerCase()
        );
        console.log('Filtered products for category:', filteredData.length);
        setProducts(filteredData);
        setFilteredProducts(filteredData);
      } else {
        setProducts(allData);
        setFilteredProducts(allData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params
          }
        });
      }
      // Set empty arrays as fallback
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        (item.features && item.features.some(feature => feature.toLowerCase().includes(query)))
      );
    }

    // Apply brand filter
    if (filters.brand.length > 0) {
      result = result.filter((item) => filters.brand.includes(item.brand));
    }

    // Apply price range filter
    if (filters.priceRange.length > 0) {
      result = result.filter((item) => {
        return filters.priceRange.some(
          (range) =>
            parseInt((item.price * (1 - item.discount)).toString()) >= range.min &&
            parseInt((item.price * (1 - item.discount)).toString()) <= range.max
        );
      });
    }

    // Apply rating filter
    if (filters.rating) {
      result = result.filter((item) => filters.rating == null || item.rating >= filters.rating);
    }

    // Apply sorting
    if (sortBy === "priceLow") {
      result = [...result].sort((a, b) =>
        (a.price * (1 - a.discount)) - (b.price * (1 - b.discount))
      );
    } else if (sortBy === "priceHigh") {
      result = [...result].sort((a, b) =>
        (b.price * (1 - b.discount)) - (a.price * (1 - a.discount))
      );
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, searchQuery, filters, sortBy]);

  const toggleFeatures = (productId: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const toggleFilterPanel = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const clearAllFilters = () => {
    setFilters({
      brand: [],
      priceRange: [],
      rating: null,
    });
    setSearchQuery('');
    setIsFilterVisible(false);
  };

  const selectBrand = (brand: string) => {
    setFilters(prev => {
      if (prev.brand.includes(brand)) {
        return { ...prev, brand: prev.brand.filter(b => b !== brand) };
      } else {
        return { ...prev, brand: [...prev.brand, brand] };
      }
    });
  };

  const selectPriceRange = (range: { label: string; min: number; max: number }) => {
    setFilters(prev => {
      const exists = prev.priceRange.some(r => r.label === range.label);
      if (exists) {
        return { ...prev, priceRange: prev.priceRange.filter(r => r.label !== range.label) };
      } else {
        return { ...prev, priceRange: [...prev.priceRange, range] };
      }
    });
  };

  const selectRating = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };

  const handleBuyNow = (item: Product) => {
    if (!isAuthenticated) {
      Toast.show({
        type: 'info',
        text1: 'Login Required',
        text2: 'Please login to continue with your purchase'
      });
      router.push('/login');
      return;
    }
    // Product buying logic goes here
    console.log('Buy now:', item.name);
  };

  const handleAddToCart = async (item: Product) => {
    if (!isAuthenticated) {
      Toast.show({
        type: 'info',
        text1: 'Login Required',
        text2: 'Please login to add items to your cart'
      });
      router.push('/login');
      return;
    }
    
    try {
      await addToCart(item);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add item to cart'
      });
    }
  };

  // Rating Stars Component
  const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <View className="flex-row">
        {Array(fullStars).fill(0).map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={14} color="#FBBF24" />
        ))}
        {hasHalfStar && (
          <Ionicons key="half" name="star-half" size={14} color="#FBBF24" />
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#D1D5DB" />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0066CC" />
        <Text className="mt-2 text-blue-600">Loading products...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-600 p-4 pt-5">
        <Text className="text-xl font-bold text-white">{categoryParam}</Text>
        <Text className="text-sm text-gray-200 mt-1">
          Showing {filteredProducts.length} results
          {filteredProducts.length > 0 && products.length > filteredProducts.length && 
            ` (filtered from ${products.length})`}
        </Text>
      </View>

      {/* Search and Filter Bar */}
      <View className="flex-row px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 mr-2">
          <Ionicons name="search" size={20} color="#666" className="mr-2" />
          <TextInput
            className="flex-1 h-10 text-sm"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          className="flex-row items-center justify-center border border-blue-600 rounded-lg px-3"
          onPress={toggleFilterPanel}
        >
          <Ionicons name="filter" size={20} color="#0066CC" />
          <Text className="ml-1 text-blue-600 font-bold text-sm">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {isFilterVisible && (
        <View className="bg-white p-4 border-b border-gray-200">
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Filters</Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text className="text-blue-600">Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Brand Filter */}
          <Text className="font-medium mt-4 mb-2">Brand</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {[...new Set(products.map(item => item.brand))].map(brand => (
              <TouchableOpacity
                key={brand}
                className={`mr-2 px-3 py-1 rounded-full border ${
                  filters.brand.includes(brand) ? "bg-blue-600 border-blue-600" : "border-gray-300"
                }`}
                onPress={() => selectBrand(brand)}
              >
                <Text className={`text-sm ${
                  filters.brand.includes(brand) ? "text-white" : "text-gray-700"
                }`}>
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price Range Filter */}
          <Text className="font-medium mt-4 mb-2">Price Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {priceRanges.map(range => (
              <TouchableOpacity
                key={range.label}
                className={`mr-2 px-3 py-1 rounded-full border ${
                  filters.priceRange.some(r => r.label === range.label) 
                    ? "bg-blue-600 border-blue-600" 
                    : "border-gray-300"
                }`}
                onPress={() => selectPriceRange(range)}
              >
                <Text className={`text-sm ${
                  filters.priceRange.some(r => r.label === range.label) 
                    ? "text-white" 
                    : "text-gray-700"
                }`}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Rating Filter */}
          <Text className="font-medium mt-4 mb-2">Rating</Text>
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`mr-2 px-3 py-1 rounded-full border ${
                filters.rating === 4 ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}
              onPress={() => selectRating(4)}
            >
              <Text className={`text-sm ${
                filters.rating === 4 ? "text-white" : "text-gray-700"
              }`}>
                4★ & up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`mr-2 px-3 py-1 rounded-full border ${
                filters.rating === 3 ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}
              onPress={() => selectRating(3)}
            >
              <Text className={`text-sm ${
                filters.rating === 3 ? "text-white" : "text-gray-700"
              }`}>
                3★ & up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`mr-2 px-3 py-1 rounded-full border ${
                filters.rating === null ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}
              onPress={() => selectRating(null)}
            >
              <Text className={`text-sm ${
                filters.rating === null ? "text-white" : "text-gray-700"
              }`}>
                All Ratings
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-blue-600 py-2 rounded-lg items-center"
            onPress={() => setIsFilterVisible(false)}
          >
            <Text className="text-white font-bold">View {filteredProducts.length} Items</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="search" size={48} color="#D1D5DB" />
          <Text className="mt-4 text-lg font-bold text-gray-800">No products found</Text>
          <Text className="mt-2 text-center text-gray-500 mb-4">
            We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
          </Text>
          <TouchableOpacity 
            className="px-4 py-2 bg-blue-600 rounded-lg"
            onPress={clearAllFilters}
          >
            <Text className="text-white font-medium">Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item._id}
          className="p-2"
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View className="bg-white rounded-lg shadow-sm m-1" style={{ width: cardWidth }}>
              <TouchableOpacity 
                className="items-center p-2"
              >
                <Image
                  source={{ uri: item.imageUrls[0] || item.thumbnail }}
                  className="w-full h-32"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              <View className="p-3">
                <TouchableOpacity 
                >
                  <Text className="text-sm font-medium text-gray-800" numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
                
                <View className="flex-row items-center mt-1">
                  <RatingStars rating={item.rating} />
                  <Text className="text-xs text-gray-500 ml-1">({item.reviews || 0})</Text>
                </View>

                <View className="mt-2">
                  <Text className="text-base font-bold text-blue-700">
                    ₹{parseInt((item.price * (1 - item.discount)).toString()).toLocaleString()}
                  </Text>
                  {item.discount > 0 && (
                    <View className="flex-row items-center mt-1">
                      <Text className="text-xs text-gray-500 line-through mr-2">
                        ₹{parseInt(item.price.toString()).toLocaleString()}
                      </Text>
                      <Text className="text-xs text-green-600 font-medium">
                        {Math.round(item.discount * 100)}% off
                      </Text>
                    </View>
                  )}
                </View>

                {/* Features */}
                <View className="mt-2">
                  {(item.features || [])
                    .slice(0, expandedFeatures[item._id] ? undefined : 2)
                    .map((feature, index) => (
                      <View key={index} className="flex-row mt-1">
                        <Text className="text-green-600 mr-1">✓</Text>
                        <Text className="text-xs text-gray-600 flex-1" numberOfLines={1}>{feature}</Text>
                      </View>
                    ))}
                  {(item.features || []).length > 2 && (
                    <TouchableOpacity onPress={() => toggleFeatures(item._id)}>
                      <Text className="text-xs text-blue-600 mt-1">
                        {expandedFeatures[item._id] ? "View less" : "View more"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Action Buttons */}
                <View className="flex-row mt-3">
                  <TouchableOpacity
                    className="flex-1 flex-row justify-center items-center py-2 mr-1 border border-blue-600 rounded"
                    onPress={() => handleAddToCart(item)}
                  >
                    <Ionicons name="cart-outline" size={16} color="#0066CC" />
                    <Text className="text-xs text-blue-600 font-medium ml-1">Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 flex-row justify-center items-center py-2 ml-1 bg-blue-600 rounded"
                    onPress={() => handleBuyNow(item)}
                  >
                    <Ionicons name="bag-outline" size={16} color="#FFFFFF" />
                    <Text className="text-xs text-white font-medium ml-1">Buy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <Toast />
    </View>
  );
};

export default ProductListing;