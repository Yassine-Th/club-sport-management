import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaFolder, FaEdit, FaTrash, FaCheckCircle, FaTimes, FaSave } from "react-icons/fa";
import instance from "../../../helpers/axios";
import Headers from "../../User/Header";
import Footer from "../Footer";
import { getUserInfo } from "../../../helpers/access_token";

const DetailNews = () => {
  const { id } = useParams();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorcomment, setErrorcomment] = useState("");
  const [errorcommentuser, setErrorcommentuser] = useState("");
  const user = getUserInfo();
  const [formdata, setFormdata] = useState({
    comment: "",
    user_id: user.id,
    news_id: id,
  });
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedCommentText, setEditedCommentText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);



  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3); // Initially show 3 comments

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await instance.get(`/news-user/${id}`);
        setActualite(response.data.news);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Impossible de charger l'article. Réessayez plus tard.");
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  useEffect(() => {
    instance
      .get(`/comments-by-news/${id}`)
      .then((response) => {
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [id]);

  const handelChangecomment = (e) => {
    setFormdata((prev) => ({
      ...prev,
      comment: e.target.value,
    }));
  };

  const handelSubmitcomment = async (e) => {
    e.preventDefault();

    if (!user.id) {
      setErrorcommentuser("Vous devez d'abord vous connecter.");
      return;
    }

    if (formdata.comment.trim() === "") {
      setErrorcomment("S'il vous plaît écrire un commentaire");
      return;
    }

    try {
      await instance
        .post("/comment-add", formdata)
        .then((response) => {
          setFormdata({ ...formdata, comment: "" });
          setErrorcomment(""); // Clear any previous error
          setComments((prevComments) => [...prevComments, response.data.comment]);
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du commentaire:", error);
        });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrorcomment("Erreur de validation");
        console.error("Erreur de validation:", error.response.data);
      } else {
        console.error("Erreur lors de l'envoi du commentaire:", error);
      }
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (editedContent.trim() === "") {
      setErrorcomment("S'il vous plaît écrire un commentaire");
      return;
    }

    try {
      await instance.put(`/comments-edit/${commentId}`, {
        content: editedContent,
      });

      // Update the comment in the list with the new content
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editedContent } : comment
        )
      );
      setEditingComment(null);
      setEditedContent("");
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedCommentText("");
  };

  const handleDelete = (id) => {
      instance
        .delete(`/comments-delete/${id}`)
        .then((response) => {
          setComments((prev) => prev.filter((comment) => comment.id !== id));
          console.log(response.data.message);
          setShowConfirmModal(false)
        })
        .catch((err) => {
          console.error("Erreur de suppression:", err);
        });
  };

  // Function to show more comments
  const handleShowMoreComments = () => {
    setVisibleCommentsCount(visibleCommentsCount + 3);
  };

  const handleShowMoreCommentsMoins = () => {
    setVisibleCommentsCount(visibleCommentsCount - 3);
  };

  if (loading) {
    return (
      <>
        <Headers />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Headers />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <Link to="/news" className="inline-flex items-center text-white bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md transition duration-300">
              <FaArrowLeft className="mr-2" /> Retour aux actualités
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!actualite) {
    return (
      <>
        <Headers />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Article non trouvé</h2>
            <p className="text-gray-600 mb-6">L'article que vous cherchez peut avoir été supprimé ou n'est plus disponible.</p>
            <Link to="/news" className="inline-flex items-center text-white bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md transition duration-300">
              <FaArrowLeft className="mr-2" /> Retour aux actualités
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = actualite.image ? `http://localhost:8000/storage/${actualite.image}` : "https://via.placeholder.com/800x400?text=No+Image+Available";

  return (
    <>
      <Headers />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image */}
          <div className="relative">
            <img src={imageUrl || "/placeholder.svg"} alt={actualite.title} className="w-full h-80 md:h-96 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center text-sm text-white space-x-4">
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-1" /> <p>{new Date(actualite.created_at).toLocaleString('fr-FR')}</p>
                </span>
                <span className="flex items-center">
                  <FaFolder className="mr-1" /> {actualite.category}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{actualite.title}</h1>
              <div className="w-16 h-1 bg-red-700 mb-6"></div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="leading-relaxed whitespace-pre-line">{actualite.content}</p>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <Link to="/news" className="inline-flex items-center text-white bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md">
                <FaArrowLeft className="mr-2" /> Retour aux actualités
              </Link>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">Commentaires</h3>
            <div className="mt-4 space-y-4">
              {comments.slice(0, visibleCommentsCount).map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="font-extrabold text-black mr-2">{comment.user.name}</span>
                    {user.role === "admin" && <FaCheckCircle color="blue" size={18} className="mr-2" />}
                  </div>                    
                  <div className="text-sm text-gray-400">{new Date(comment.created_at).toLocaleString()}</div>
                  </div>
                  {editingComment === comment.id ? (
                    <div>
                       <textarea
                       className="w-full h-32 p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        />
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                        >
                          <FaSave className="mr-2" /> Sauvegarder
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
                        >
                          <FaTimes className="mr-2" /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700">{comment.content}</p>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-blue-600 hover:text-blue-800 px-4 py-2"
                        >
                          <FaEdit className="mr-2" /> 
                        </button>
                        <button
                          onClick={() => setShowConfirmModal(true)}
                          className="text-red-600 hover:text-red-800 px-4 py-2"
                        >
                          <FaTrash className="mr-2" /> 
                        </button>
                        {showConfirmModal && (
                          <div
                            className="fixed inset-0 flex items-center justify-center z-[9999]"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                          >                          
                           <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                              <h2 className="text-lg font-semibold mb-4 text-center">Confirmer la suppression</h2>
                              <p className="mb-6 text-center">Voulez-vous vraiment supprimer ce commentaire ?</p>
                              <div className="flex justify-center gap-4">
                                <button
                                  onClick={() => {
                                    handleDelete(comment.id)
                                  }}
                                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                >
                                  Supprimer
                                </button>
                                <button
                                  onClick={() => setShowConfirmModal(false)}
                                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Show more button */}
             <div className="mt-4 text-center space-x-4">
              {visibleCommentsCount < comments.length && (
              <button
                onClick={handleShowMoreComments}
                className="text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 px-4 py-2 rounded-md bg-transparent"
              >
                Voir plus de commentaires
              </button>
              )}
              {visibleCommentsCount > 3  && (
                 <button
                onClick={handleShowMoreCommentsMoins}
                className="text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 px-4 py-2 rounded-md bg-transparent"
              >
                Voir moins de commentaires
              </button>
              )}
            </div>
          </div>

          {/* Add Comment */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">Ajouter un commentaire</h3>
            {errorcomment && <div className="text-red-600 text-sm">{errorcomment}</div>}
            {errorcommentuser && <div className="text-red-600 text-sm">{errorcommentuser}</div>}
            <form onSubmit={handelSubmitcomment} className="mt-4">
             <textarea
                className="w-full h-32 p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                value={formdata.comment}
                onChange={handelChangecomment}
                placeholder="Écrivez votre commentaire ici..."
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Ajouter un commentaire
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default DetailNews;
