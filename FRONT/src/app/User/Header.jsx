import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
} from "lucide-react";
import logo from "../../assets/logo.png"; // Adjust the path as necessary

function Header() {
  return (
    <header>
      {/* Top Bar */}
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
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img src={logo} alt="" />
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
            <Link to="/equipe" className="text-red-700 hover:text-red-200">
              ÉQUIPE
            </Link>
            <Link to="/matchs" className="text-red-700 hover:text-red-200">
              MATCHS
            </Link>
            <Link to="/actualites" className="text-red-700 hover:text-red-200">
              ACTUALITÉS
            </Link>
            <Link to="/boutique" className="text-red-700 hover:text-red-200">
              BOUTIQUE
            </Link>
          </div>

          {/* Membership Buttons */}
          <div className="flex space-x-4">
            <Link
              to="/register"
              className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="bg-white text-red-700 border border-red-700 px-4 py-2 rounded-md hover:bg-red-700 hover:text-white transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
