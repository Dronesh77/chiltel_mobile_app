import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { allCategories, categoryImageMap } from '@/components/categoriesData';
import ServiceModel from './ServiceModel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ChillMartScreenNavigationProp } from '../types';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

type ChillMartScreenProps = {
  navigation: ChillMartScreenNavigationProp;
};

const ChillMart = () => {
  // Use the useNavigation hook to get navigation object
  const navigation = useNavigation<ChillMartScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [isDomestic, setIsDomestic] = useState<boolean | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string } | null>(null);

  const mainCategories = [...new Set(allCategories.map(item => item.mainCategory))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setCategories(allCategories);
          setFilteredCategories(allCategories);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading categories:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilters = () => {
    let result = [...categories];
    if (selectedMainCategory) {
      result = result.filter(item => item.mainCategory === selectedMainCategory);
    }
    if (isDomestic !== null) {
      result = result.filter(item => {
        if (isDomestic) return item.type === "Cooling";
        return item.type !== "Cooling";
      });
    }
    setFilteredCategories(result);
    setFilterVisible(false);
  };

  const selectMainCategory = (category: string) => {
    setSelectedMainCategory(prev => prev === category ? null : category);
  };

  const selectDomestic = (isDomesticValue: boolean) => {
    setIsDomestic(prev => prev === isDomesticValue ? null : isDomesticValue);
  };

  const clearAllFilters = () => {
    setSelectedMainCategory(null);
    setIsDomestic(null);
    setFilteredCategories(categories);
    setFilterVisible(false);
  };

  const toggleFilterPanel = () => {
    setFilterVisible(!filterVisible);
  };

  useEffect(() => {
    if (categories.length > 0) applyFilters();
  }, [selectedMainCategory, isDomestic]);

  const handleServiceBook = () => {
    setServiceModalVisible(false);
    setSelectedCategory(null);
  };

  const handleNavigateToProductListing = (item: any) => {
    // Check if item.category exists, otherwise use item.name as a fallback
    const categoryParam = item.category || item.name;
    
    // Debug log to help troubleshoot navigation issues
    console.log('Navigating to ProductListing with category:', categoryParam);
    
    try {
      if (navigation) {
        // Navigate with required params according to your type definitions
        navigation.navigate('ProductListing', {
          category: categoryParam
        });
      } else {
        console.error('Navigation object is undefined');
        Alert.alert('Navigation Error', 'Unable to navigate to product listing. Please try again.');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading ChillMart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>ChillMart</Text>
        <Text style={styles.subheading}>Find the best appliance solutions</Text>
      </View>

      <View style={styles.filterButtonContainer}>
        <View style={styles.filterInfo}>
          <Text style={styles.filterCountText}>Showing {filteredCategories.length} appliances</Text>
          {(selectedMainCategory || isDomestic !== null) && (
            <TouchableOpacity onPress={clearAllFilters} style={styles.clearFilterButton}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterPanel}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {filterVisible && (
        <View style={styles.filterPanel}>
          <View style={styles.filterPanelHeader}>
            <Text style={styles.filterPanelTitle}>Filter By Category</Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Main Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            {mainCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterChip,
                  selectedMainCategory === category && styles.filterChipSelected
                ]}
                onPress={() => selectMainCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedMainCategory === category && styles.filterChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterSectionTitle}>Appliance Type</Text>
          <View style={styles.domesticFilterContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                isDomestic === true && styles.filterChipSelected
              ]}
              onPress={() => selectDomestic(true)}
            >
              <Text style={[
                styles.filterChipText,
                isDomestic === true && styles.filterChipTextSelected
              ]}>
                Domestic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                isDomestic === false && styles.filterChipSelected
              ]}
              onPress={() => selectDomestic(false)}
            >
              <Text style={[
                styles.filterChipText,
                isDomestic === false && styles.filterChipTextSelected
              ]}>
                Commercial
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.applyFilterButton}
            onPress={() => setFilterVisible(false)}
          >
            <Text style={styles.applyFilterText}>View {filteredCategories.length} Items</Text>
          </TouchableOpacity>
        </View>
      )}

      <ServiceModel
        isVisible={isServiceModalVisible}
        onClose={() => {
          setServiceModalVisible(false);
          setSelectedCategory(null);
        }}
        onBook={handleServiceBook}
        category={selectedCategory}
      />

      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={categoryImageMap[item.image]}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => handleNavigateToProductListing(item)}
                >
                  <Text style={styles.purchaseButtonText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.serviceButton}
                  onPress={() => {
                    setSelectedCategory({ name: item.name });
                    setServiceModalVisible(true);
                  }}
                >
                  <Text style={styles.serviceButtonText}>Service</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066CC',
    padding: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subheading: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: 12,
    color: '#666',
  },
  clearFilterButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearFilterText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: 'bold',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#0066CC',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  filterButtonText: {
    color: '#0066CC',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterPanel: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterPanelTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 8,
  },
  clearAllText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: 'bold',
  },
  filterOptions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  domesticFilterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipSelected: {
    backgroundColor: '#e1f0ff',
    borderColor: '#0066CC',
  },
  filterChipText: {
    fontSize: 12,
    color: '#333',
  },
  filterChipTextSelected: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  applyFilterButton: {
    backgroundColor: '#0066CC',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  applyFilterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productList: {
    padding: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 6,
    width: cardWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    height: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  purchaseButton: {
    backgroundColor: '#0066CC',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 4,
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  serviceButton: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#0066CC',
    flex: 1,
    marginLeft: 4,
  },
  serviceButtonText: {
    color: '#0066CC',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#0066CC',
  },
});

export default ChillMart;