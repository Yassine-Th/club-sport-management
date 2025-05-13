import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
} from "lucide-react";
import logo from "../../assets/logo.png"; // Adjust the path as necessary
import { CartIcon } from "./Boutique/Cart";
import { CartSidebar } from "./Boutique/Cart";
import Logout from "../../Auth/Logout";
function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [auth,setAuth] = React.useState(false);

   useEffect(() => {
    if(user){
      setAuth(true);
    }
   })
  
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
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img src={logo || "/placeholder.svg"} alt="" />
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
            <Link to="/news" className="text-red-700 hover:text-red-200">
              ACTUALITÉS
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
