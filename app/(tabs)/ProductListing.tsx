import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Star, StarHalf } from 'lucide-react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type ProductListingRouteProp = RouteProp<RootStackParamList, 'ProductListing'>;

type ProductListingProps = {
  route: ProductListingRouteProp;
};

type Product = {
  id: number;
  name: string;
  image: string;
  originalPrice: string;
  discountedPrice: string;
  discount: string;
  description: string;
  rating: number;
  reviews: number;
  brand: string;
  features: string[];
  category: string;
};

const productsData: Record<string, Product[]> = {
  "Air Conditioner": [
    {
      id: 1,
      name: "Carrier 1.5 Ton 5 Star AI Flexicool Inverter Split AC",
      image: "https://yourdomain.com/assets/products/ac1.jpg",
      originalPrice: "₹67,990",
      discountedPrice: "₹32,999",
      discount: "51%",
      description: "Split AC with Flexicool Inverter Compressor...",
      rating: 4.5,
      reviews: 2584,
      brand: "Carrier",
      features: ["1.5 Ton Capacity", "5 Star Rating", "Auto Cleansing", "Dual Inverter"],
      category: "Air Conditioner"
    },
    {
      id: 2,
      name: "Daikin 1.5 Ton 3 Star Inverter Split AC",
      image: "https://yourdomain.com/assets/products/ac2.jpg",
      originalPrice: "₹55,990",
      discountedPrice: "₹39,990",
      discount: "29%",
      description: "Split AC with Inverter Compressor...",
      rating: 4.3,
      reviews: 1876,
      brand: "Daikin",
      features: ["1.5 Ton Capacity", "3 Star Rating", "PM 2.5 Filter", "Copper Coil"],
      category: "Air Conditioner"
    }
  ]
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} size={16} color="#facc15" fill="#facc15" />
      ))}
      {hasHalfStar && <StarHalf size={16} color="#facc15" fill="#facc15" />}
      <Text style={{ marginLeft: 6, color: '#4b5563', fontSize: 12 }}>{rating}</Text>
    </View>
  );
};

const ProductListing: React.FC<ProductListingProps> = ({ route }) => {
  const { product } = route.params;
  const category = product.category;
  const products = productsData[category] || [];

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        {category}
      </Text>
      <Text style={{ color: '#6b7280', marginBottom: 16 }}>
        Showing {products.length} results
      </Text>

      {products.map((product) => (
        <View
          key={product.id}
          style={{
            backgroundColor: 'white',
            marginBottom: 16,
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 2
          }}
        >
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', height: 180, resizeMode: 'contain', marginBottom: 12 }}
          />
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
            {product.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <RatingStars rating={product.rating} />
            <Text style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>
              ({product.reviews} reviews)
            </Text>
          </View>

          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
            {product.discountedPrice}
          </Text>
          <Text style={{ textDecorationLine: 'line-through', color: '#9ca3af', fontSize: 12 }}>
            {product.originalPrice}
          </Text>
          <Text style={{ color: '#059669', fontWeight: '500', fontSize: 12 }}>
            Save {product.discount}
          </Text>

          <Text style={{ color: '#4b5563', marginTop: 8 }}>{product.description}</Text>

          <Text style={{ marginTop: 10, fontWeight: '600' }}>Key Features:</Text>
          {product.features.map((feat, idx) => (
            <Text key={idx} style={{ marginLeft: 12, fontSize: 12 }}>
              • {feat}
            </Text>
          ))}

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 6,
                marginRight: 10
              }}
            >
              <Text style={{ color: '#fff' }}>Buy Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#000',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 6
              }}
            >
              <Text style={{ color: '#000' }}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ProductListing;