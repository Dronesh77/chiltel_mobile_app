export interface Product {
  __v: number;
  _id: string;
  availability: boolean;
  brand: string;
  category: string;
  createdAt: string;
  discount: number;
  features: string[];
  imageUrls: string[];
  inStock: number;
  mainCategory: string;
  model: string;
  name: string;
  price: number;
  rating: number;
  requestedStatus: string;
  reviews: number;
  specifications: {
    [key: string]: string;
  };
  thumbnail: string;
  type: string;
}

export interface Category {
  id?: string;
  name: string;
  mainCategory: string;
  type: string;
  image: string;
  description: string;
}

export type RootStackParamList = {
  Home: undefined;
  ProductList: { category: string };
  ProductDetail: { productId: string };
  Cart: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  ServiceRequest: undefined;
}; 