import React from "react";
import { useEffect, useState } from "react";
import Header from "../Header";
import instance from "../../../helpers/axios";
import { Filter, ShoppingBag, ShoppingCart, Sliders } from "lucide-react";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    instance
      .get("/products")
      .then((response) => {
        const productsData = response.data.data;
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            productsData.map((product) =>
              product.category ? product.category.name : null
            )
          ),
        ].filter(Boolean);
        setCategories(uniqueCategories);

        // Extract unique genders
        const uniqueGenders = [
          ...new Set(
            productsData
              .filter((product) => product.clothes)
              .map((product) => product.clothes.gender)
          ),
        ].filter(Boolean);
        setGenders(uniqueGenders);

        // Find max price for range
        const maxPrice = Math.max(
          ...productsData.map((product) => Number.parseFloat(product.price))
        );
        setPriceRange({ min: 0, max: Math.ceil(maxPrice) });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedGender, priceRange, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category && product.category.name === selectedCategory
      );
    }

    // Filter by gender
    if (selectedGender !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.clothes && product.clothes.gender === selectedGender
      );
    }

    // Filter by price
    filtered = filtered.filter((product) => {
      const price = Number.parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (e) => {
    setPriceRange({
      ...priceRange,
      [e.target.name]: Number.parseInt(e.target.value),
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
      <Header />
      {/* Store Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <button
              className="md:hidden flex items-center justify-center gap-2 bg-white text-red-700 px-4 py-2 rounded-lg shadow-md mb-4"
              onClick={toggleFilters}
            >
              <Sliders className="w-5 h-5" />
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </button>

            {/* Filters Sidebar */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 bg-white rounded-lg shadow-lg p-4`}
            >
              <div className="mb-6">
                <h3 className="font-title text-xl text-gray-800 mb-3 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtres
                </h3>
                <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-red-700 mb-4"></div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-section text-lg mb-2">Catégories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="mr-2 accent-red-600"
                      />
                      Toutes les catégories
                    </label>
                    {categories.map((category, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-2 accent-red-600"
                        />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender Filter */}
                {genders.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-section text-lg mb-2">Genre</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          checked={selectedGender === "all"}
                          onChange={() => setSelectedGender("all")}
                          className="mr-2 accent-red-600"
                        />
                        Tous
                      </label>
                      {genders.map((gender, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            checked={selectedGender === gender}
                            onChange={() => setSelectedGender(gender)}
                            className="mr-2 accent-red-600"
                          />
                          {gender === "men"
                            ? "Homme"
                            : gender === "women"
                            ? "Femme"
                            : "Unisexe"}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-section text-lg mb-2">Prix</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600">
                        Min: {priceRange.min}€
                      </label>
                      <input
                        type="range"
                        name="min"
                        min="0"
                        max={priceRange.max}
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        className="w-full accent-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">
                        Max: {priceRange.max}€
                      </label>
                      <input
                        type="range"
                        name="max"
                        min="0"
                        max={priceRange.max}
                        value={priceRange.max}
                        onChange={handlePriceChange}
                        className="w-full accent-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl text-white">Nos Produits</h2>
                <div className="text-white font-section">
                  {filteredProducts.length} produit
                  {filteredProducts.length !== 1 ? "s" : ""} trouvé
                  {filteredProducts.length !== 1 ? "s" : ""}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white bg-opacity-90 rounded-lg p-8 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-red-600 mb-4" />
                  <h3 className="font-title text-xl mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos filtres pour voir plus de produits.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
                    >
                      <div className="h-56 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-title text-white text-xl">
                            PRODUIT
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-title text-lg">{product.name}</h3>
                          {product.clothes && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {product.clothes.gender === "men"
                                ? "Homme"
                                : product.clothes.gender === "women"
                                ? "Femme"
                                : "Unisexe"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-section text-red-600 font-bold">
                            {Number.parseFloat(product.price).toFixed(2)}€
                          </span>
                          <button className="flex items-center text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            ACHETER
                          </button>
                        </div>
                        {product.clothes && product.clothes.sizes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">
                              Tailles disponibles:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {product.clothes.sizes.map((size) => (
                                <span
                                  key={size.id}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                                >
                                  {size.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Boutique;
