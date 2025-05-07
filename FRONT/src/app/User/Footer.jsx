import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.png"

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 rounded-full text-white font-title text-xl mr-3">
                  <img src={logo} alt="" className='w-[100%] rounded-b-lg'/>
                </div>
                <h3 className="font-title text-xl">HUSA ⵃⵓⵙⴰ </h3>
              </div>
              <p className="text-gray-400 text-sm">
                Le site officiel du club de football HUSA. Suivez les dernières
                actualités, matchs et rejoignez notre communauté.
              </p>
            </div>

            <div>
              <h4 className="font-section text-lg mb-4">LIENS RAPIDES</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-gray-400 hover:text-white">
                    Actualités
                  </Link>
                </li>
                <li>
                  <Link to="/team" className="text-gray-400 hover:text-white">
                    Équipe
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fixtures"
                    className="text-gray-400 hover:text-white"
                  >
                    Calendrier
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-section text-lg mb-4">CONTACT</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email : info@husaclub.com</li>
                <li>Téléphone : +212 123 456 789</li>
                <li>Adresse : Adresse du stade, Ville</li>
              </ul>
            </div>

            <div>
              <h4 className="font-section text-lg mb-4">NEWSLETTER</h4>
              <p className="text-gray-400 text-sm mb-4">
                Abonnez-vous à notre newsletter pour recevoir les dernières
                infos
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button className="bg-red-600 text-white px-4 rounded-r-lg hover:bg-red-700">
                  OK
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Club HUSA. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 hover:text-white cursor-pointer">
                FB
              </span>
              <span className="text-gray-400 hover:text-white cursor-pointer">
                TW
              </span>
              <span className="text-gray-400 hover:text-white cursor-pointer">
                IG
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer