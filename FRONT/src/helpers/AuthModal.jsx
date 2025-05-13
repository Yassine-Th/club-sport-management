import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Icon for the close button

export default function AuthModal({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Veuillez vous connecter</h2>
        <p className="mb-6">
          Vous devez être connecté pour consulter votre panier.
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            S’inscrire
          </button>
          <button
            onClick={() => navigate("/login", { state: { from: location.pathname }, replace: true })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}
