import React, { useEffect, useState } from "react";
import Header from "../Header";
import instance from "../../../helpers/axios";
import {
  Filter,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  // priceRange holds the user-selected values; maxLimit is the absolute max
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [maxLimit, setMaxLimit] = useState(100);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

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

        // Determine the absolute max price
        const absoluteMax = Math.ceil(
          Math.max(...productsData.map((p) => parseFloat(p.price)))
        );
        setMaxLimit(absoluteMax);
        setPriceRange({ min: 0, max: absoluteMax });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    filterProducts();
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [selectedCategory, selectedGender, priceRange, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category && product.category.name === selectedCategory
      );
    }

    // Gender filter
    if (selectedGender !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.clothes && product.clothes.gender === selectedGender
      );
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (e) => {
    const updatedRange = {
      ...priceRange,
      [e.target.name]: parseFloat(e.target.value),
    };

    if (updatedRange.min > updatedRange.max) {
      updatedRange.min = updatedRange.max;
    }

    setPriceRange(updatedRange);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
      <Header />
      <section className="py-8 px-0">
        <div className="w-full">
          <div className="flex flex-col md:flex-row">
            {/* Mobile Filter Toggle */}
            <button
              className="md:hidden flex items-center justify-center gap-2 bg-white text-red-700 px-4 py-2 rounded-lg shadow-md mx-4 mb-4"
              onClick={toggleFilters}
            >
              <Sliders className="w-5 h-5" />
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </button>

            {/* Filters Sidebar */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 bg-white rounded-lg shadow-lg p-4 mx-4 md:mx-4`}
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
                          {gender === "homme"
                            ? "Homme"
                            : gender === "femme"
                            ? "Femme"
                            : gender === "enfant"
                            ? "Enfant"
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
                        Min: {priceRange.min} DH
                      </label>
                      <input
                        type="range"
                        name="min"
                        min={0}
                        max={maxLimit}
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        className="w-full accent-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">
                        Max: {priceRange.max} DH
                      </label>
                      <input
                        type="range"
                        name="max"
                        min={priceRange.min}
                        max={maxLimit}
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
            <div className="flex-1 px-4 md:px-4">
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
                <>
                  {/* Products Grid Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
                    {currentProducts && currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
                        >
                          <Link
                            to={`/boutique/${product.id}`}
                            className="block"
                          >
                            <div className="h-80 relative">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name || "Produit"}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.svg";
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                  <span className="font-title text-white text-xl">
                                    PRODUIT
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link
                              to={`/boutique/${product.id}`}
                              className="block"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-title text-lg font-medium">
                                  {product.name || "Produit"}
                                </h3>

                                {product.clothes && product.clothes.gender && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    {product.clothes.gender === "homme"
                                      ? "Homme"
                                      : product.clothes.gender === "femme"
                                      ? "Femme"
                                      : product.clothes.gender === "enfant"
                                      ? "Enfant"
                                      : " "}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description || ""}
                              </p>
                            </Link>
                            <div className="flex justify-between items-center">
                              <span className="font-section text-red-600 font-bold">
                                {product.price
                                  ? Number.parseFloat(product.price).toFixed(2)
                                  : "0.00"}
                                DH
                              </span>
                              <button
                                className="flex items-center text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Add your cart logic here
                                }}
                              >
                                <ShoppingCart className="w-4 h-6 mr-1" />
                                Ajouter au panier
                              </button>
                            </div>
                            {product.clothes &&
                              product.clothes.sizes &&
                              product.clothes.sizes.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Tailles disponibles:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {product.clothes.sizes.map((size) => (
                                      <span
                                        key={size.id || size.label || index}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                                      >
                                        {size.label || size}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8">
                        <p>Aucun produit trouvé</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {filteredProducts.length > productsPerPage && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex items-center bg-white rounded-lg shadow-md">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`p-2 ${
                            currentPage === 1
                              ? "text-gray-400"
                              : "text-red-600 hover:bg-red-50"
                          } rounded-l-lg transition-colors`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((num) => {
                              // Show first page, last page, current page and one page before and after current
                              return (
                                num === 1 ||
                                num === totalPages ||
                                num === currentPage ||
                                num === currentPage - 1 ||
                                num === currentPage + 1
                              );
                            })
                            .map((number, index, array) => (
                              <React.Fragment key={number}>
                                {index > 0 &&
                                  array[index - 1] !== number - 1 && (
                                    <span className="px-3 py-2 text-gray-500">
                                      ...
                                    </span>
                                  )}
                                <button
                                  onClick={() => paginate(number)}
                                  className={`px-3 py-2 ${
                                    currentPage === number
                                      ? "bg-red-600 text-white"
                                      : "text-red-600 hover:bg-red-50"
                                  } transition-colors`}
                                >
                                  {number}
                                </button>
                              </React.Fragment>
                            ))}
                        </div>

                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`p-2 ${
                            currentPage === totalPages
                              ? "text-gray-400"
                              : "text-red-600 hover:bg-red-50"
                          } rounded-r-lg transition-colors`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Boutique;
