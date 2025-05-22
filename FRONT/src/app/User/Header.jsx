import React, { useEffect, useState, useRef } from "react"; // Added useRef
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
  ChevronDown,
} from "lucide-react";
import logo from "../../assets/logo.png"; // Adjust the path as necessary
import { CartIcon } from "./Boutique/Cart";
import { CartSidebar } from "./Boutique/Cart";
import Logout from "../../Auth/Logout";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [auth, setAuth] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null); // Ref to store timeout ID

  useEffect(() => {
    if (user) {
      setAuth(true);
    }
  }, []); // Removed 'user' from dependency array as it's only checked on mount

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Adjust delay as needed (e.g., 200-300ms)
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header>
      {/* Top Bar */}
      <CartSidebar />
      <div className="bg-gradient-to-r from-red-700 to-red-800 text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-sm">
            {/* Contact Information */}
            <a href="tel:+212123456789" className="mr-4 hover:text-red-200">
              Appelez-nous: +212 123 456 789
            </a>
            <a
              href="mailto:contact@husa-football.com"
              className="hover:text-red-200"
            >
              Email: contact@husa-football.com
            </a>
          </div>
          <div className="flex space-x-3">
            {/* Social Media Links */}
            <a href="#" className="hover:text-red-200">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-red-200">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-red-200">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-red-200">
              <MessageCircle size={18} />
            </a>
            <a href="#" className="hover:text-red-200">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-gradient-to-r from-white to-white shadow-md text-white">
        <div className="container mx-auto flex justify-between items-center py-2 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img src={logo || "/placeholder.svg"} alt="HUSA Logo" />{" "}
              {/* Added alt text */}
            </div>
            <div className="text-2xl font-bold text-red-700 font-title">
              HUSA ⵃⵓⵙⴰ
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-x-6 font-section">
            <Link to="/" className="text-red-700 hover:text-red-200">
              ACCUEIL
            </Link>
            <Link to="/news" className="text-red-700 hover:text-red-200">
              ACTUALITÉS
            </Link>
            {/* ÉQUIPE with dropdown */}
            <div
              className="inline-block relative group"
              onMouseEnter={handleMouseEnter} // Applied new handler
              onMouseLeave={handleMouseLeave} // Applied new handler
            >
              <div className="flex items-center text-red-700 hover:text-red-200 cursor-pointer">
                <Link to="/equipe" className="mr-1">
                  {" "}
                  {/* Link is fine here, part of the trigger */}
                  ÉQUIPE
                </Link>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 z-20 min-w-[150px] flex-col bg-white shadow-lg rounded-md overflow-hidden border border-red-100 transition-opacity duration-200 ${
                  isDropdownOpen ? "flex opacity-100" : "hidden opacity-0"
                }`}
                // onMouseEnter and onMouseLeave are on the parent div already,
                // but adding them here ensures the menu itself is also part of the hoverable area
                // for the timeout logic.
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/equipe/players"
                  className="px-4 py-2 text-red-700 hover:bg-red-50 hover:text-red-900 text-left border-b border-red-100 transition-colors duration-200"
                >
                  Joueurs
                </Link>
                <Link
                  to="/equipe/histoire"
                  className="px-4 py-2 text-red-700 hover:bg-red-50 hover:text-red-900 text-left transition-colors duration-200"
                >
                  Histoire
                </Link>
              </div>
            </div>

            <Link to="/matches" className="text-red-700 hover:text-red-200">
              MATCHES
            </Link>
            <Link to="/billetterie" className="text-red-700 hover:text-red-200">
              BILLETTERIE
            </Link>
            <Link to="/boutique" className="text-red-700 hover:text-red-200">
              BOUTIQUE
            </Link>
          </div>

          {/* Membership Buttons and Cart */}
          <div className="flex space-x-4 items-center">
            <CartIcon />
            <div className="flex items-center space-x-4">
              {auth ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/commandes"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md flex items-center justify-center"
                  >
                    Mes Commandes
                  </Link>
                  <Logout className="ml-2" />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md flex items-center justify-center"
                  >
                    S'inscrire
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition duration-300 shadow-md flex items-center justify-center"
                  >
                    Connexion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
