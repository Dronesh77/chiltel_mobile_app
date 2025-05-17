import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SEO } from './SEO';

interface Category {
  name: string;
  mainCategory: string;
  type: string;
  image: string;
  description: string;
}

const ServiceCollection: React.FC = () => {
  const router = useRouter();

  const categories: Category[] = [
    { name: "Air Conditioner", mainCategory: "Domestic", type: "Cooling", image: "/assets/air_conditioner.webp", description: "Professional AC services including installation, repair, and maintenance" },
    { name: "Water Purifier", mainCategory: "Domestic", type: "Water", image: "/assets/water_purifier.webp", description: "Expert water purifier installation and maintenance services" },
    { name: "Geyser", mainCategory: "Domestic", type: "Heating", image: "/assets/gey.webp", description: "Comprehensive geyser repair and installation services" },
    { name: "Microwave", mainCategory: "Domestic", type: "Cooking", image: "/assets/microwave.webp", description: "Expert microwave repair and maintenance services" },
    { name: "Refrigerator", mainCategory: "Domestic", type: "Cooling", image: "/assets/refrigwrator.webp", description: "Professional refrigerator repair and maintenance services" },
    { name: "Washing Machine", mainCategory: "Domestic", type: "Cleaning", image: "/assets/washing_machine.webp", description: "Expert washing machine repair and maintenance services" },
    { name: "Deep Freezer", mainCategory: "Retail", type: "Cooling", image: "/assets/deep_freeze.webp", description: "High-quality deep freezers for your storage needs." },
    { name: "Visi Cooler", mainCategory: "Retail", type: "Cooling", image: "/assets/Visi _Coole.webp", description: "Reliable visi coolers for commercial use." },
    { name: "Cassette AC", mainCategory: "Retail", type: "Cooling", image: "/assets/Cassett.jpg", description: "Efficient cooling with cassette air conditioners." },
    { name: "Water Cooler Cum Purifier", mainCategory: "Retail", type: "Water", image: "/assets/water_cooler.webp", description: "Dual-function water cooler and purifier." },
    { name: "Water Dispenser", mainCategory: "Retail", type: "Water", image: "/assets/Water-dis.webp", description: "Convenient and portable water dispensers." },
    { name: "Display Counter", mainCategory: "Retail", type: "Display", image: "/assets/display-counter.", description: "Attractive display counters for showcasing products." },
  ];

  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sortType, setSortType] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const toggleMainCategory = (category: string) => {
    setMainCategoryFilter(prev => (prev === category ? null : category));
    setTypeFilter([]);
  };

  const toggleType = (type: string) => {
    setTypeFilter(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filterCategories = () => {
    let updatedCategories = categories;
    if (mainCategoryFilter) {
      updatedCategories = updatedCategories.filter(cat => cat.mainCategory === mainCategoryFilter);
    }
    if (typeFilter.length > 0) {
      updatedCategories = updatedCategories.filter(cat => typeFilter.includes(cat.type));
    }
    setFilteredCategories(updatedCategories);
  };

  const sortCategories = () => {
    let sortedCategories = [...filteredCategories];
    sortedCategories.sort((a, b) =>
      sortType === 'name' ? a.name.localeCompare(b.name) : 0
    );
    setFilteredCategories(sortedCategories);
  };

  const handleButtonClick = (category: string, type: string) => {
    router.push(`/products/${category.toLowerCase().replace(/ /g, '-')}?type=${type}`);
  };

  useEffect(() => {
    filterCategories();
  }, [mainCategoryFilter, typeFilter]);

  useEffect(() => {
    sortCategories();
  }, [sortType, filteredCategories]);

  return (
    <>
    <SEO page="serviceCollection" />
    <div className="container px-4 py-8 mx-auto">
      <header className="flex items-center justify-between pb-4 mb-8 border-b">
        <h1 className="text-3xl font-bold">Welcome to Chill Mart</h1>
        <div>
          <label className="text-gray-700">Sort by: </label>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="p-2 ml-2 border border-gray-300 rounded"
          >
            <option value="name">Relevance</option>
          </select>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <aside className={`md:w-1/4 md:pr-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 mb-6 border rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">MAIN CATEGORY</h3>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="mainCategory"
                  checked={mainCategoryFilter === "Domestic"}
                  onChange={() => toggleMainCategory("Domestic")}
                />
                <span>Domestic</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="mainCategory"
                  checked={mainCategoryFilter === "Retail"}
                  onChange={() => toggleMainCategory("Retail")}
                />
                <span>Retail</span>
              </label>
            </div>
          </div>

          {mainCategoryFilter && (
            <div className="p-4 border rounded-lg">
              <h3 className="mb-4 text-lg font-semibold">TYPE</h3>
              <div className="flex flex-col space-y-2">
                {Array.from(new Set(categories.filter(cat => cat.mainCategory === mainCategoryFilter).map(cat => cat.type))).map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={typeFilter.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 mb-4 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white md:hidden"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <main className="md:w-3/4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-48 mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleButtonClick(category.name, 'purchase')}
                    className="flex-1 px-4 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
                  >
                    Purchase
                  </button>
                  <button
                    onClick={() => handleButtonClick(category.name, 'service')}
                    className="flex-1 px-4 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
                  >
                    Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export default ServiceCollection;