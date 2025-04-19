import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Modal,
  SafeAreaView,
  ImageSourcePropType,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ShopContext, useShop } from '@/context/ShopContext';
import AuthContext, { useAuth } from '@/context/AuthContext';
import ServiceModal from './ServiceModel';
import ServiceRequestDialog from '@/components/ServiceCreateDialog';
import { Filter, X, ChevronDown } from 'react-native-feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // adjust path if needed

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define interface for category items
interface Category {
  name: string;
  mainCategory: string;
  type: string;
  image: string | ImageSourcePropType;
  description: string;
}

const categories = [
  {
      name: "Air Conditioner",
      mainCategory: "Domestic Appliance",
      type: "Cooling",
      image: "/assets/air_conditioner.jpeg",
      description: "Professional Split AC services including installation, repair, and maintenance",
  },
  {
      name: "Air Cooler",
      mainCategory: "Domestic Appliance",
      type: "Cooling",
      image: "/assets/cooler.jpg",
      description: "Professional air cooler services for optimal cooling performance",
  },
  // {
  //     name: "Air Purifier",
  //     mainCategory: "Domestic Appliance",
  //     type: "Cooling",
  //     image: "/assets/air_puri.jpg",
  //     description: "Professional air purifier services for optimal cooling performance",
  // },
  {
      name: "Water Purifier",
      mainCategory: "Domestic Appliance",
      type: "Water",
      image: "/assets/water_purifier.jpeg",
      description: "Expert water purifier installation and maintenance services",
  },
  {
      name: "Geyser",
      mainCategory: "Domestic Appliance",
      type: "Heating",
      image: "/assets/geyser.jpg",
      description: "Comprehensive geyser repair and installation services",
  },
  {
      name: "Microwave",
      mainCategory: "Kitchen Appliance",
      type: "Cooking",
      image: "/assets/microwave.jpeg",
      description: "Expert microwave repair and maintenance services",
  },
  {
      name: "Refrigerator",
      mainCategory: "Domestic Appliance",
      type: "Cooling",
      image: "/assets/refrigerator.jpeg",
      description: "Professional refrigerator repair and maintenance services",
  },
  {
      name: "Washing Machine",
      mainCategory: "Domestic Appliance",
      type: "Cleaning",
      image: "/assets/washing_machine.jpeg",
      description: "Expert washing machine repair and maintenance services",
  },
  // {
  //     name: "Deep Freezer",
  //     mainCategory: "Retail Appliance",
  //     type: "Cooling",
  //     image: "/assets/deep_freeze.webp",
  //     description: "High-quality deep freezers for your storage needs.",
  // },
  // {
  //     name: "Visi Cooler",
  //     mainCategory: "Retail Appliance",
  //     type: "Cooling",
  //     image: "/assets/Visi _Coole.webp",
  //     description: "Reliable visi coolers for commercial use.",
  // },
  // {
  //     name: "Cassette AC",
  //     mainCategory: "Retail Appliance",
  //     type: "Cooling",
  //     image: "/assets/cas.webp",
  //     description: "Efficient cooling with cassette air conditioners.",
  // },
  // {
  //     name: "Water Cooler Cum Purifier",
  //     mainCategory: "Retail Appliance",
  //     type: "Water",
  //     image: "/assets/water_cooler.webp",
  //     description: "Dual-function water cooler and purifier.",
  // },
  // {
  //     name: "Water Dispenser",
  //     mainCategory: "Retail Appliance",
  //     type: "Water",
  //     image: "/assets/Water-dis.webp",
  //     description: "Convenient and portable water dispensers.",
  // },
  // {
  //     name: "Display Counter",
  //     mainCategory: "Retail Appliance",
  //     type: "Display",
  //     image: "/assets/display-counter.webp",
  //     description: "Attractive display counters for showcasing products.",
  // },
  // {
  //     name: "Water Cooler",
  //     mainCategory: "Kitchen Appliance",
  //     type: "Cooling",
  //     image: "/assets/wcooler.jpeg",
  //     description: "Commercial water cooler for professional use",
  // },
  // {
  //     name: "Upright Chiller",
  //     mainCategory: "Kitchen Appliance",
  //     type: "Display",
  //     image: "/assets/uchiller.jpeg",
  //     description: "Professional upright chiller for commercial use",
  // },
  // {
  //     name: "Under Counter",
  //     mainCategory: "Kitchen Appliance",
  //     type: "Display",
  //     image: "/assets/ucounter.webp",
  //     description: "Space-saving under counter chiller",
  // },
  // {
  //     name: "Back Bar Chiller",
  //     mainCategory: "Kitchen Appliance",
  //     type: "Display",
  //     image: "/assets/bbchiler.jpeg",
  //     description: "Efficient back bar chiller for beverages",
  // },
  // {
  //     name: "Food Prep Chiller",
  //     mainCategory: "Kitchen Appliance",
  //     type: "Display",
  //     image: "/assets/fprep.jpeg",
  //     description: "Food preparation chiller for professional kitchens",
  // },
  // {
  //     name: "Ice Maker",
  //     mainCategory: "Kitchen Appliance",
  //     type: "Cooling",
  //     image: "/assets/icube.webp",
  //     description: "Commercial ice cube maker",
  // },
];

const ServiceCollection = () => {
  const { backendUrl } = useShop();
  const { sessionId } = useAuth();
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sortType, setSortType] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories1, setCategories1] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchAndFormatData = async () => {
      try {
        setProductsLoading(true);
        // Fetch the product list from the API
        const response = await axios.get(backendUrl + '/api/product/list');

        if (response.data.success) {
          const products = response.data.data;

          // Extract unique categories
          const uniqueCategories: Category[] = [];
          products.forEach((product: any) => {
            let localImage: ImageSourcePropType;

            // Map images based on category names
            switch (product.category) {
              case "Air Conditioner":
                localImage = require("@/assets/air_conditioner.jpeg")
                break;
              case "Air Cooler":
                localImage = require("@/assets/cooler.jpg");
                break;
              // ... other image mappings
              default:
                localImage = require("@/assets/air_conditioner.jpeg"); // Default image
            }

            if (!uniqueCategories.some((item) => item.name === product.category)) {
              uniqueCategories.push({
                name: product.category,
                mainCategory: product.mainCategory,
                type: product.type.charAt(0).toUpperCase() + product.type.slice(1),
                description: `Buy ${(product.category.startsWith('A') || product.category.startsWith('I')) ? "an" : "a"} ${product.category.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} | Get Expert Repair & Maintenance Services.`,
                image: localImage,
              });
            }
          });
          setCategories1(uniqueCategories); // Update state with unique categories
        } else {
          console.error("Failed to retrieve products:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchAndFormatData(); // Call the async function
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/services/', {
        headers: {
          Authorization: sessionId,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleMainCategory = (category: string) => {
    setMainCategoryFilter((prev) => (prev === category ? null : category));
    setTypeFilter([]);
  };

  const toggleType = (type: string) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleButtonClick = (category: string, type: string) => {
    if (type === "purchase") {
      const categorySlug = category.toLowerCase().replace(/ /g, "-");
      navigation.navigate("ProductList", { category: categorySlug });
    } else if (type === "service") {
      setSelectedCategory(categories1.find((cat) => cat.name === category) || null);
      setIsServiceModalOpen(true);
    }
  };

  // Function to clear all filters
  const clearFilters = () => {
    setMainCategoryFilter(null);
    setTypeFilter([]);
  };

  useEffect(() => {
    let updatedCategories = [...categories1];

    if (mainCategoryFilter) {
      updatedCategories = updatedCategories.filter(
        (cat) => cat.mainCategory === mainCategoryFilter
      );
    }

    if (typeFilter.length > 0) {
      updatedCategories = updatedCategories.filter((cat) =>
        typeFilter.includes(cat.type)
      );
    }

    if (sortType === "name") {
      updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredCategories(updatedCategories);
  }, [mainCategoryFilter, typeFilter, sortType, categories1]);

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <View className="bg-white rounded-xl overflow-hidden shadow mb-4 elevation-2">
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-2">{item.name}</Text>
        <Text className="text-gray-600 mb-4 text-sm" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => handleButtonClick(item.name, "purchase")}
            className="flex-1 bg-blue-600 py-3 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonClick(item.name, "service")}
            className="flex-1 border border-blue-600 py-3 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-blue-600 font-semibold">Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView className="flex-1 bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl mt-auto max-h-5/6">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-900">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X width={24} height={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView className="p-5">
            <View className="mb-6">
              <Text className="font-bold text-gray-900 mb-4 text-lg">MAIN CATEGORY</Text>
              <View className="space-y-4">
                <TouchableOpacity 
                  onPress={() => toggleMainCategory("Domestic Appliance")}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded-full border-2 ${mainCategoryFilter === "Domestic Appliance" ? "border-blue-600 bg-blue-600" : "border-gray-300"} items-center justify-center`}>
                    {mainCategoryFilter === "Domestic Appliance" && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="ml-3 text-gray-700 text-base">Domestic Appliance</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => toggleMainCategory("Retail Appliance")}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded-full border-2 ${mainCategoryFilter === "Retail Appliance" ? "border-blue-600 bg-blue-600" : "border-gray-300"} items-center justify-center`}>
                    {mainCategoryFilter === "Retail Appliance" && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="ml-3 text-gray-700 text-base">Retail Appliance</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => toggleMainCategory("Kitchen Appliance")}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded-full border-2 ${mainCategoryFilter === "Kitchen Appliance" ? "border-blue-600 bg-blue-600" : "border-gray-300"} items-center justify-center`}>
                    {mainCategoryFilter === "Kitchen Appliance" && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="ml-3 text-gray-700 text-base">Kitchen Appliance</Text>
                </TouchableOpacity>
              </View>
            </View>

            {mainCategoryFilter && (
              <View className="mb-6">
                <Text className="font-bold text-gray-900 mb-4 text-lg">TYPE</Text>
                <View className="space-y-4">
                  {Array.from(
                    new Set(
                      categories
                        .filter((cat) => cat.mainCategory === mainCategoryFilter)
                        .map((cat) => cat.type)
                    )
                  ).map((type) => (
                    <TouchableOpacity 
                      key={type}
                      onPress={() => toggleType(type)}
                      className="flex-row items-center"
                    >
                      <View className={`w-6 h-6 rounded-md border ${typeFilter.includes(type) ? "bg-blue-600 border-blue-600" : "border-gray-300"} items-center justify-center`}>
                        {typeFilter.includes(type) && (
                          <Text className="text-white text-xs">✓</Text>
                        )}
                      </View>
                      <Text className="ml-3 text-gray-700 text-base">{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
          
          <View className="p-4 border-t border-gray-200 flex-row gap-3">
            <TouchableOpacity 
              onPress={clearFilters}
              className="flex-1 py-3 bg-gray-100 rounded-lg items-center"
            >
              <Text className="text-gray-700 font-semibold">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowFilters(false)}
              className="flex-1 py-3 bg-blue-600 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3">
        <View className="mb-5">
          <Text className="text-3xl font-bold text-gray-900 text-center">Welcome to Chill Mart</Text>
          <Text className="text-sm text-gray-600 text-center mt-1">
            Find the best appliance solutions in one place
          </Text>
        </View>

        {/* Filter Button */}
        <TouchableOpacity 
          onPress={() => setShowFilters(true)}
          className="flex-row items-center justify-center bg-white py-3 rounded-lg shadow-sm mb-4"
          activeOpacity={0.7}
        >
          <Filter width={18} height={18} stroke="#4B5563" className="mr-2" />
          <Text className="text-gray-700 font-medium">Filters</Text>
        </TouchableOpacity>

        {/* Active Filters Display */}
        {(mainCategoryFilter || typeFilter.length > 0) && (
          <View className="flex-row flex-wrap mb-4">
            {mainCategoryFilter && (
              <View className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                <Text className="text-blue-800 text-xs mr-1">{mainCategoryFilter}</Text>
                <TouchableOpacity onPress={() => setMainCategoryFilter(null)}>
                  <X width={12} height={12} stroke="#1E40AF" />
                </TouchableOpacity>
              </View>
            )}
            {typeFilter.map(type => (
              <View 
                // key={type} 
                className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
              >
                <Text className="text-blue-800 text-xs mr-1">{type}</Text>
                <TouchableOpacity onPress={() => toggleType(type)}>
                  <X width={12} height={12} stroke="#1E40AF" />
                </TouchableOpacity>
              </View>
            ))}
            {(mainCategoryFilter || typeFilter.length > 0) && (
              <TouchableOpacity 
                onPress={clearFilters}
                className="bg-gray-200 rounded-full px-3 py-1 mb-2"
              >
                <Text className="text-gray-700 text-xs">Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {productsLoading ? (
          <View className="flex-1 justify-center items-center py-12">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 text-gray-600">Loading appliances...</Text>
          </View>
        ) : filteredCategories.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center justify-center shadow-sm mt-4">
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Text className="text-2xl">😕</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-700 mb-2 text-center">No appliances found</Text>
            <Text className="text-gray-500 mb-6 text-center">Try adjusting your filter criteria</Text>
            <TouchableOpacity 
              onPress={clearFilters}
              className="bg-blue-600 py-3 px-6 rounded-lg"
            >
              <Text className="text-white font-semibold">Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-700">
                Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'appliance' : 'appliances'}
              </Text>
            </View>
            
            <FlatList
              data={filteredCategories}
              renderItem={renderCategoryCard}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        )}
      </View>
      
      {renderFilterModal()}
      
      {isServiceModalOpen && (
        <ServiceModal
          isVisible={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          onBook={() => {setShowSuccessDialog(true); setIsServiceModalOpen(false)}}
          category={selectedCategory}
        />
      )}
      
      {showSuccessDialog && <ServiceRequestDialog visible={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} />}
    </SafeAreaView>
  );
};

export default ServiceCollection;