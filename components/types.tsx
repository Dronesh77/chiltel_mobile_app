// types.ts
export interface Category {
  name: string;
  mainCategory: string;
  type: string;
  image: string;
  description: string;
}

export interface Stat {
  end: number;
  text: string;
  color: string;
  icon: string;
}

// Navigation types for the app
export type RootStackParamList = {
  Home: undefined;
  Collection: undefined;
  // Add other routes here if you have more
};
