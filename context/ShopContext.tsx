import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// Define types for better TypeScript support
type Product = {
  id: string;
  name: string;
  price: number;
  // Add other product properties as needed
};

type ShopContextType = {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (search: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  navigate: any;
  backendUrl: string;
  buyNowProduct: Product | null;
  setBuyNowProduct: (product: Product | null) => void;
};

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ShopContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency = "Rs";
  const delivery_fee = 299;
  const backendUrl = "https://api.chiltel.com";
  
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  
  const navigation = useNavigation();

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.data.reverse());
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate: navigation,
    backendUrl,
    buyNowProduct,
    setBuyNowProduct,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook for easier context consumption
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopContextProvider");
  }
  return context;
};

export default ShopContextProvider;