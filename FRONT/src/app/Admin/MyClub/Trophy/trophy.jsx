import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaTrophy, FaExclamationCircle } from "react-icons/fa";
import { PlusCircle } from "lucide-react";
import instance from "../../../../helpers/axios";

const Trophy = () => {
  const [trophy, setTrophy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrophy = async () => {
      setLoading(true);
      try {
        const response = await instance.get("/trophy");
        setTrophy(response.data.trophy);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getTrophy();
  }, []);

 const handelDelet = async (id) => {
  if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا اللقب؟")) return;

  try {
    await instance.delete(`/trophy-delete/${id}`);
    setTrophy(prev => prev.filter(item => item.id !== id));
  } catch (error) {
    console.error("خطأ أثناء حذف اللقب:", error);
    alert("حدث خطأ أثناء حذف اللقب. حاول مرة أخرى.");
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-medium text-gray-600">
        <span className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></span>
        <span className="ml-4">Chargement en cours...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaTrophy className="text-red-500" /> Liste des Titres
        </h2>
        <Link
          to="/admin/create-titres"
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow transition"
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border border-gray-100">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Titre</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Compétition</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Fois Gagnées</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trophy.length > 0 ? (
              trophy.map((item) => (
                <tr key={item.id} className="hover:bg-red-50 transition-colors">
                  <td className="px-3 py-2 font-medium text-gray-800">{item.id}</td>
                  <td className="px-3 py-2 text-gray-700">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                      {item.title || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-700 max-w-[120px] truncate">{item.competition}</td>
                  <td className="px-3 py-2 text-gray-700">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                      {item.times_won || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center gap-4">
                      <Link
                        to={`/admin/edit-titres/${item.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <FaEdit size={16} />
                      </Link>
                      <button
                        onClick={() => 
                          handelDelet(item.id)
                        }
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaExclamationCircle className="text-gray-400 text-3xl mb-2" />
                    <p className="text-sm">Aucun titre trouvé pour le moment.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trophy;
