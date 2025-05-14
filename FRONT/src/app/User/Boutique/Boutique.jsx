import React, { useEffect, useState } from "react";
import Header from "../Header";
import instance from "../../../helpers/axios";
import {
  Filter,
  ShoppingBag,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AddToCartButton, CartSidebar } from "./Cart";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
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

        // Extract unique types
        const uniqueTypes = [
          ...new Set(
            productsData
              .filter((product) => product.clothes)
              .map((product) => product.clothes.type)
          ),
        ].filter(Boolean);
        setTypes(uniqueTypes);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    filterProducts();
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [selectedCategory, selectedGender, selectedType, products]);

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

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (product) => product.clothes && product.clothes.type === selectedType
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Pagination helpers
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-red-700">
      <Header />
      <CartSidebar />

      <div className="bg-white shadow-md border-t-red-600 mt-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h2 className="font-title text-xl text-red-600 font-bold">
                BOUTIQUE OFFICIELLE
              </h2>

              {/* Category Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-800 hover:text-red-600 font-medium py-2 transition-colors">
                  <span>Catégories</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-md w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                        selectedCategory === "all"
                          ? "bg-red-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Toutes les catégories
                    </button>
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-red-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gender Dropdown */}
              {genders.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-800 hover:text-red-600 font-medium py-2 transition-colors">
                    <span>Pour qui</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-md w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => setSelectedGender("all")}
                        className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                          selectedGender === "all"
                            ? "bg-red-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Tous
                      </button>
                      {genders.map((gender, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedGender(gender)}
                          className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                            selectedGender === gender
                              ? "bg-red-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {gender === "homme"
                            ? "Homme"
                            : gender === "femme"
                            ? "Femme"
                            : gender === "enfant"
                            ? "Enfant"
                            : "Unisexe"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Type Dropdown */}
              {types.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-800 hover:text-red-600 font-medium py-2 transition-colors">
                    <span>Type</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-md w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => setSelectedType("all")}
                        className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                          selectedType === "all"
                            ? "bg-red-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Tous les types
                      </button>
                      {types.map((type, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedType(type)}
                          className={`block w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${
                            selectedType === type
                              ? "bg-red-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products Counter */}
            <div className="hidden md:block">
              <span className="bg-red-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                {filteredProducts.length} produit
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-title text-2xl text-white">Nos Produits</h2>
            <div className="md:hidden text-white font-section bg-red-700 bg-opacity-40 px-4 py-2 rounded-full">
              {filteredProducts.length} produit
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg">
              <ShoppingBag className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h3 className="font-title text-2xl mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Essayez de modifier vos filtres pour voir plus de produits.
              </p>
            </div>
          ) : (
            <>
            {
              /* Products Grid - More products per row */
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentProducts && currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Link to={`/boutique/${product.id}`} className="block relative group">
                      <div className="h-56 relative overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name || "Produit"}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                            <span className="font-title text-white text-xl">PRODUIT</span>
                          </div>
                        )}
                      </div>
            
                      {/* Category/Gender Badge */}
                      {product.clothes && product.clothes.gender && (
                        <span className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded-sm font-medium">
                          {product.clothes.gender === "homme"
                            ? "Homme"
                            : product.clothes.gender === "femme"
                            ? "Femme"
                            : product.clothes.gender === "enfant"
                            ? "Enfant"
                            : "Unisexe"}
                        </span>
                      )}
                    </Link>
            
                    <div className="p-3">
                      <Link to={`/boutique/${product.id}`} className="block">
                        <h3 className="font-title text-sm font-medium truncate hover:text-red-600 transition-colors">
                          {product.name || "Produit"}
                        </h3>
                        <p className="text-gray-600 text-xs mt-1 mb-2 line-clamp-2 h-8">
                          {product.description || ""}
                        </p>
                      </Link>
            
                      <div className="flex flex-col items-start">
                        <span className="font-section text-lg text-red-600 font-bold mb-2">
                          {product.price
                            ? Number.parseFloat(product.price).toFixed(2)
                            : "0.00"}{" "}
                          DH
                        </span>
            
                        {product.clothes ? (
                          <Link
                            to={`/boutique/${product.id}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors"
                          >
                            Voir les tailles
                          </Link>
                        ) : (
                          <AddToCartButton
                            product={product}
                            quantity={1}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors"
                          />
                        )}
                      </div>
            
                      {product.clothes &&
                        product.clothes.sizes &&
                        product.clothes.sizes.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex flex-wrap gap-1">
                              {product.clothes.sizes.map((size, index) => (
                                <span
                                  key={size.id || size.label || index}
                                  className="text-xs bg-gray-100 px-2 py-0.5 rounded"
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
                <div className="col-span-5 text-center py-8 text-white">
                  <p>Aucun produit trouvé</p>
                </div>
              )}
            </div>;
            
            {
              /* Improved Pagination */
            }
            {
              filteredProducts.length > productsPerPage && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-3 ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      } transition-colors`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
            
                    {/* Page Numbers */}
                    <div className="flex">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((num) => {
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
                            {index > 0 && array[index - 1] !== number - 1 && (
                              <span className="px-3 py-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => paginate(number)}
                              className={`w-10 h-10 flex items-center justify-center ${
                                currentPage === number
                                  ? "bg-red-600 text-white"
                                  : "text-red-600 hover:bg-red-50"
                              } transition-colors`}
                              aria-label={`Page ${number}`}
                              aria-current={currentPage === number ? "page" : undefined}
                            >
                              {number}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>
            
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`p-3 ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      } transition-colors`}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}</>
          )}
        </div>
      </section>
    </div>
  );
};

export default Boutique;

