import React, { useEffect, useState } from 'react';
import axios from 'axios';
import instance from '../../../helpers/axios';
import { ChevronRight, PlusCircle, Pencil,Trophy  } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamDetail = () => {
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyClub = async () => {
      setLoading(true);
      try {
        const response = await instance.get('/myclub');
        setTeam(response.data.myclub);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getMyClub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-medium text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      {/* زر إضافة */}
      <div className="flex justify-end mb-4">
        {
            !team ? 
             
                <Link
                to="/admin/create-myclub"
                className="group flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 font-semibold text-sm"
                >
                <PlusCircle className="h-4 w-4" />
                Ajouter
                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
            : <Link
                to="/admin/create-titres"
                className="group flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 font-semibold text-sm"
                >
                <Trophy className="h-4 w-4" />
                Ajouter Titres
                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
        }
          
        
      </div>

      {/* معلومات الفريق */}
      <div className="flex items-center mb-6">
        <img
          src={`http://localhost:8000/storage/${team?.logo}`}
          alt={team?.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-red-600 mr-6"
        />
        <h1 className="text-3xl font-bold text-gray-800">{team?.name}</h1>
      </div>

      <div className="space-y-3 text-base text-gray-700 leading-relaxed">
        <p><span className="font-semibold">City:</span> {team?.city}</p>
        <p><span className="font-semibold">Founded:</span> {team?.founded}</p>
        <p><span className="font-semibold">Stadium:</span> {team?.stadium_name} <span className="text-sm text-gray-500">(Capacity: {team?.stadium_capacity})</span></p>
        <p><span className="font-semibold">President:</span> {team?.president}</p>
        <p><span className="font-semibold">Coach:</span> {team?.coach_name}</p>
        <p><span className="font-semibold">Description:</span> {team?.description}</p>
      </div>

      {/* زر تعديل */}
      <div className="mt-8 text-end">
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow"
        >
          <Pencil className="h-4 w-4" />
          <Link to={`/admin/edit-myclub/${team?.id}`}>Edit Team</Link>
        </button>
      </div>
    </div>
  );
};

export default TeamDetail;
