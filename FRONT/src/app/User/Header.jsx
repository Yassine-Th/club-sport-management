import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { CartIcon } from "./Boutique/Cart";
import { CartSidebar } from "./Boutique/Cart";
import Logout from "../../Auth/Logout";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [auth, setAuth] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      setAuth(true);
    }
  }, []);

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
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="relative">
      <CartSidebar />

      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-red-700 to-red-800 text-white py-1">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-xs flex items-center space-x-4">
            <a
              href="tel:+212123456789"
              className="flex items-center hover:text-red-200 transition-colors"
            >
              <Phone size={12} className="mr-1" />
              +212 123 456 789
            </a>
            <a
              href="mailto:contact@husa-football.com"
              className="flex items-center hover:text-red-200 transition-colors"
            >
              <Mail size={12} className="mr-1" />
              contact@husa-football.com
            </a>
          </div>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-red-200 transition-colors">
              <Facebook size={14} />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors">
              <Instagram size={14} />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors">
              <Twitter size={14} />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors">
              <MessageCircle size={14} />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors">
              <Youtube size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b border-red-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-1 md:py-2">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 flex-shrink-0 z-10"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="HUSA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-lg md:text-xl font-bold text-red-700 font-title">
                HUSA <span className="hidden sm:inline">ⵃⵓⵙⴰ</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 font-section flex-1 justify-center">
              <Link
                to="/"
                className="text-red-700 hover:text-red-900 transition-colors text-sm font-medium whitespace-nowrap"
              >
                ACCUEIL
              </Link>
              <Link
                to="/news"
                className="text-red-700 hover:text-red-900 transition-colors text-sm font-medium whitespace-nowrap"
              >
                ACTUALITÉS
              </Link>

              {/* ÉQUIPE with dropdown */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center text-red-700 hover:text-red-900 cursor-pointer text-sm font-medium transition-colors whitespace-nowrap">
                  <Link to="#" className="mr-1" disabled>
                    ÉQUIPE
                  </Link>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                <div
                  className={`absolute left-1/2 -translate-x-1/2 mt-1 z-20 min-w-[140px] bg-white shadow-lg rounded-md overflow-hidden border border-red-100 transition-all duration-200 ${
                    isDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/equipe/joueurs"
                    className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 border-b border-red-100 transition-colors"
                  >
                    Effectif
                  </Link>
                  <Link
                    to="/equipe/histoire"
                    className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors"
                  >
                    Histoire
                  </Link>
                </div>
              </div>

              <Link
                to="/matches"
                className="text-red-700 hover:text-red-900 transition-colors text-sm font-medium whitespace-nowrap"
              >
               CALENDRIER
              </Link>
              <Link
                to="/billetterie"
                className="text-red-700 hover:text-red-900 transition-colors text-sm font-medium whitespace-nowrap"
              >
                BILLETTERIE
              </Link>
              <Link
                to="/boutique"
                className="text-red-700 hover:text-red-900 transition-colors text-sm font-medium whitespace-nowrap"
              >
                BOUTIQUE
              </Link>
            </div>

            {/* Right Side - Cart and Auth */}
            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
              <CartIcon />

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                {auth ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/commandes"
                      className="px-2 xl:px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs xl:text-sm font-medium whitespace-nowrap"
                    >
                      Mes Commandes
                    </Link>
                    <Logout />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/register"
                      className="px-2 xl:px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs xl:text-sm font-medium whitespace-nowrap"
                    >
                      S'inscrire
                    </Link>
                    <Link
                      to="/login"
                      className="px-2 xl:px-3 py-1.5 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors text-xs xl:text-sm font-medium whitespace-nowrap"
                    >
                      Connexion
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="lg:hidden p-2 text-red-700 hover:text-red-900 transition-colors z-10"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="bg-white w-full max-w-sm ml-auto h-full overflow-y-auto shadow-xl border-l border-red-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-4 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="HUSA Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-lg font-bold text-red-700 font-title">
                    HUSA
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-red-700 hover:text-red-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  <Link
                    to="/"
                    className="block py-3 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md px-3 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ACCUEIL
                  </Link>
                  <Link
                    to="/news"
                    className="block py-3 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md px-3 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ACTUALITÉS
                  </Link>
                  <Link
                    to="/equipe"
                    className="block py-3 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md px-3 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ÉQUIPE
                  </Link>
                  <Link
                    to="/equipe/joueurs"
                    className="block py-2 pl-6 pr-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    • Effectif
                  </Link>
                  <Link
                    to="/equipe/histoire"
                    className="block py-2 pl-6 pr-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    • Histoire
                  </Link>
                  <Link
                    to="/matches"
                    className="block py-3 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md px-3 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MATCHES
                  </Link>
                  <Link
                    to="/billetterie"
                    className="block py-3 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md px-3 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    BILLETTERIE
                  </Link>
                  <Link
                    to="/boutique"
                    className="block py-3 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md px-3 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    BOUTIQUE
                  </Link>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-red-100 space-y-3">
                  {auth ? (
                    <div className="space-y-3">
                      <Link
                        to="/commandes"
                        className="block w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-center font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Mes Commandes
                      </Link>
                      <div onClick={() => setIsMobileMenuOpen(false)}>
                        <Logout />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/register"
                        className="block w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-center font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        S'inscrire
                      </Link>
                      <Link
                        to="/login"
                        className="block w-full py-3 px-4 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors text-center font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Connexion
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Contact Info */}
                <div className="pt-4 border-t border-red-100 space-y-3">
                  <a
                    href="tel:+212123456789"
                    className="flex items-center text-red-600 hover:text-red-800 py-2 px-3 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Phone size={16} className="mr-3" />
                    +212 123 456 789
                  </a>
                  <a
                    href="mailto:contact@husa-football.com"
                    className="flex items-center text-red-600 hover:text-red-800 py-2 px-3 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Mail size={16} className="mr-3" />
                    contact@husa-football.com
                  </a>

                  {/* Mobile Social Links */}
                  <div className="flex justify-center space-x-6 pt-4">
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <MessageCircle size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Youtube size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
