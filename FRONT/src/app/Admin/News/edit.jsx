import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../../helpers/axios';
import { getUserInfo } from '../../../helpers/access_token';

const EditNew = () => {
    const { id } = useParams();
    const user = getUserInfo();
    const user_id = user.id;
    
    const [error, setError] = useState({});
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState({
        author_id: user_id,
        title: "",
        content: "",
        category: "",
        image: null,
    }); 

    useEffect(() => {
        instance.get(`/news/${id}`)
            .then((response) => {
                const data = response.data.news;
                setNews({
                    author_id: data.author_id || user_id,
                    title: data.title || "",
                    content: data.content || "",  
                    category: data.category || "",
                    image: data.image || null,
                });
            })
            .catch((error) => {
                console.error("Error fetching news:", error);
            });
    }, [id, user_id]);

    const handleChange = (e) => { 
        setNews({ ...news, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNews({ ...news, image: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend?.append("author_id", news.author_id);
        formDataToSend?.append("title", news.title);
        formDataToSend?.append("content", news.content);
        formDataToSend?.append("category", news.category);
        
        if (news.image) {
            formDataToSend.append("image", news.image);
        }
        
        try {
            setLoading(true);
            const response = await instance.put(`/news/update/${id}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSuccess(response.data.message);
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 422) {
                setError(error.response.data.errors);
                console.error("Erreur de validation :", error.response.data);
            }
            console.error("Error during update:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Succès !</strong>
                    <span className="block sm:inline">{success}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    📰 Modifier une actualité
                </h1>

                <form encType="multipart/form-data" className="space-y-6" onSubmit={handleSubmit}>
                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            name="title"
                            value={news.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Titre de l'actualité"
                        />
                        {error.title && <p className="text-red-500 text-sm mt-1">{error.title[0]}</p>}
                    </div>

                    {/* Contenu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <textarea
                            name="content"
                            rows={5}
                            value={news.content}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Décris l'actualité..."
                        />
                        {error.content && <p className="text-red-500 text-sm mt-1">{error.content[0]}</p>}
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select
                            name="category"
                            value={news.category}
                            onChange={handleChange}
                            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choisir une catégorie</option>
                            <option value="match">Match</option>
                            <option value="transfer">Transfert</option>
                            <option value="club">Club</option>
                            <option value="other">Autre</option>
                        </select>
                        {error.category && <p className="text-red-500 text-sm mt-1">{error.category[0]}</p>}
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                            type="file"
                            name="image"
                            id="imgInput"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {error.image && <p className="text-red-500 text-sm mt-1">{error.image[0]}</p>}
                    </div>

                    {/* Bouton Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Chargement...' : 'Modifier l\'actualité'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNew;
