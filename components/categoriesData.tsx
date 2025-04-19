// data.tsx or constants.tsx

import type { Category, Stat } from "./types"; // optional if using types separately

export const allCategories: Category[] = [
  {
    name: "Air Conditioner",
    mainCategory: "Appliance",
    type: "Cooling",
    image: "air_conditioner",
    description: "Professional Split AC services including installation, repair, and maintenance",
  },
  {
    name: "Refrigerator",
    mainCategory: "Appliance",
    type: "Cooling",
    image: "refrigerator",
    description: "Professional refrigerator repair and maintenance services",
  },
  {
    name: "Cassette AC",
    mainCategory: "Retail",
    type: "Cooling",
    image: "refrigerator", // reused
    description: "Efficient cooling with cassette air conditioners.",
  },
  {
    name: "Display Counter",
    mainCategory: "Retail",
    type: "Display",
    image: "refrigerator", // reused
    description: "Attractive display counters for showcasing products.",
  },
  {
    name: "Water Purifier",
    mainCategory: "Appliance",
    type: "Water",
    image: "water_purifier",
    description: "Expert water purifier installation and maintenance services",
  },
  {
    name: "Geyser",
    mainCategory: "Appliance",
    type: "Heating",
    image: "geyser",
    description: "Comprehensive geyser repair and installation services",
  },
  {
    name: "Microwave",
    mainCategory: "Appliance",
    type: "Cooking",
    image: "microwave",
    description: "Expert microwave repair and maintenance services",
  },
  {
    name: "Washing Machine",
    mainCategory: "Appliance",
    type: "Cleaning",
    image: "washing_machine",
    description: "Expert washing machine repair and maintenance services",
  },
  {
    name: "Water Cooler Cum Purifier",
    mainCategory: "Retail",
    type: "Water",
    image: "water_cooler",
    description: "Dual-function water cooler and purifier.",
  },
];

export const categoryImageMap: Record<string, any> = {
  air_conditioner: require("@/assets/air_conditioner.jpeg"),
  refrigerator: require("@/assets/refrigerator.jpeg"),
  water_purifier: require("@/assets/water_purifier.jpeg"),
  geyser: require("@/assets/geyser.jpg"),
  microwave: require("@/assets/microwave.jpeg"),
  washing_machine: require("@/assets/washing_machine.jpeg"),
  water_cooler: require("@/assets/water_purifier.jpeg"),
};

export const stats: Stat[] = [
  {
    end: 15,
    text: "Years Experience",
    color: "blue",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806...",
  },
  {
    end: 1531,
    text: "Happy Customers",
    color: "green",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7...",
  },
  {
    end: 37,
    text: "Expert Technicians",
    color: "purple",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944...",
  },
];