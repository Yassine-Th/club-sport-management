import React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFolder,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimes,
  FaSave,
  FaUser,
  FaComment,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"
import { ChevronRight } from "lucide-react"
import instance from "../../../helpers/axios"
import Headers from "../../User/Header"
import Footer from "../Footer"
import { getUserInfo } from "../../../helpers/access_token"

const DetailNews = () => {
  const { id } = useParams()
  const [actualite, setActualite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorcomment, setErrorcomment] = useState("")
  const [errorcommentuser, setErrorcommentuser] = useState("")
  const user = getUserInfo()
  const [formdata, setFormdata] = useState({
    comment: "",
    user_id: user.id,
    news_id: id,
  })
  const [comments, setComments] = useState([])
  const [editingComment, setEditingComment] = useState(null)
  const [editedContent, setEditedContent] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3)
  const [relationNews, setRelationNews] = useState(null)
  const [showFull, setShowFull] = useState(false)
  const maxChars = 20

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await instance.get(`/news-user/${id}`)
        setActualite(response.data.news)
        setRelationNews(response.data.relationNews)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Impossible de charger l'article. Réessayez plus tard.")
        setLoading(false)
      }
    }
    fetchNewsDetail()
  }, [id])

  useEffect(() => {
    instance
      .get(`/comments-by-news/${id}`)
      .then((response) => {
        setComments(response.data.comments)
      })
      .catch((error) => {
        console.error("Error fetching comments:", error)
      })
  }, [id])

  // Check if any comment is long
  const hasLongComment = comments.some((comment) => comment.content.length > maxChars)

  // Update showFull automatically if comments change
  useEffect(() => {
    if (hasLongComment) {
      setShowFull(false)
    }
  }, [hasLongComment])

  const handelChangecomment = (e) => {
    setFormdata((prev) => ({
      ...prev,
      comment: e.target.value,
    }))
  }

  const handelSubmitcomment = async (e) => {
    e.preventDefault()

    if (!user.id) {
      setErrorcommentuser("Vous devez d'abord vous connecter.")
      return
    }

    if (formdata.comment.trim() === "") {
      setErrorcomment("S'il vous plaît écrire un commentaire")
      return
    }

    try {
      await instance
        .post("/comment-add", formdata)
        .then((response) => {
          setFormdata({ ...formdata, comment: "" })
          setErrorcomment("")
          setComments((prevComments) => [...prevComments, response.data.comment])
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du commentaire:", error)
        })
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrorcomment("Erreur de validation")
        console.error("Erreur de validation:", error.response.data)
      } else {
        console.error("Erreur lors de l'envoi du commentaire:", error)
      }
    }
  }

  const handleEdit = (comment) => {
    setEditingComment(comment.id)
    setEditedContent(comment.content)
  }

  const handleSaveEdit = async (commentId) => {
    if (editedContent.trim() === "") {
      setErrorcomment("S'il vous plaît écrire un commentaire")
      return
    }

    try {
      await instance.put(`/comments-edit/${commentId}`, {
        content: editedContent,
      })

      setComments((prevComments) =>
        prevComments.map((comment) => (comment.id === commentId ? { ...comment, content: editedContent } : comment)),
      )
      setEditingComment(null)
      setEditedContent("")
    } catch (error) {
      console.error("Erreur de mise à jour:", error)
    }
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditedContent("")
  }

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId)
    setShowConfirmModal(true)
  }

  const handleDelete = () => {
    if (!commentToDelete) return

    instance
      .delete(`/comments-delete/${commentToDelete}`)
      .then((response) => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentToDelete))
        console.log(response.data.message)
        setShowConfirmModal(false)
        setCommentToDelete(null)
      })
      .catch((err) => {
        console.error("Erreur de suppression:", err)
      })
  }

  const handleShowMoreComments = () => {
    setVisibleCommentsCount(visibleCommentsCount + 3)
  }

  const handleShowLessComments = () => {
    setVisibleCommentsCount(Math.max(3, visibleCommentsCount - 3))
  }

  if (loading) {
    return (
      <>
        <Headers />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Headers />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="text-red-600 text-xl mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
            <Link
              to="/news"
              className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              <FaArrowLeft className="mr-2" /> Retour aux actualités
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!actualite) {
    return (
      <>
        <Headers />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Article non trouvé</h2>
            <p className="text-gray-600 mb-6">
              L'article que vous cherchez peut avoir été supprimé ou n'est plus disponible.
            </p>
            <Link
              to="/news"
              className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              <FaArrowLeft className="mr-2" /> Retour aux actualités
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const imageUrl = actualite.image
    ? `http://localhost:8000/storage/${actualite.image}`
    : "https://via.placeholder.com/800x400?text=No+Image+Available"

  return (
    <>
      <Headers />
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Image with gradient overlay */}
          <div className="relative">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={actualite.title}
              className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 md:p-8 lg:p-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">
                {actualite.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-white/90 space-x-6">
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-red-400" />
                  <p>{new Date(actualite.created_at).toLocaleString("fr-FR")}</p>
                </span>
                <span className="flex items-center">
                  <FaFolder className="mr-2 text-red-400" />
                  <span className="bg-red-600/80 px-3 py-1 rounded-full text-xs font-semibold">
                    {actualite.category}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            <div className="mb-10">
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 mb-8 rounded-full"></div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="leading-relaxed whitespace-pre-line text-lg">{actualite.content}</p>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <Link
                to="/news"
                className="inline-flex items-center text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg transition duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <FaArrowLeft className="mr-2" /> Retour aux actualités
              </Link>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <FaComment className="text-red-600 text-xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Commentaires</h3>
              <div className="ml-auto text-sm font-medium px-3 py-1 bg-red-100 text-red-800 rounded-full">
                {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="space-y-6">
              {comments.slice(0, visibleCommentsCount).map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border-l-4 border-red-500"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mr-3 text-white">
                        <FaUser />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 mr-2">{comment.user.name}</span>
                          {user.role === "admin" && <FaCheckCircle className="text-blue-500" />}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</div>
                      </div>
                    </div>

                    {(user.id === comment.user_id || user.role === "admin") && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(comment.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingComment === comment.id ? (
                    <div className="mt-4">
                      <textarea
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300 min-h-[120px] resize-none"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                      <div className="flex justify-end space-x-3 mt-3">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition shadow hover:shadow-md"
                        >
                          <FaSave className="mr-2" /> Sauvegarder
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition shadow hover:shadow-md"
                        >
                          <FaTimes className="mr-2" /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="bg-gray-50 p-4 rounded-md border border-gray-100 mb-2 text-gray-800"
                        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                      >
                        {showFull || comment.content.length <= maxChars
                          ? comment.content
                          : comment.content.substring(0, maxChars) + "..."}
                      </div>

                      {comment.content.length > maxChars && (
                        <button
                          onClick={() => setShowFull((prev) => !prev)}
                          className="text-red-600 hover:text-red-800 font-semibold transition duration-200 flex items-center"
                        >
                          <span className="mr-2">{showFull ? "Afficher moins" : "Afficher plus"}</span>
                          {showFull ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination buttons */}
            {comments.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {visibleCommentsCount < comments.length && (
                  <button
                    onClick={handleShowMoreComments}
                    className="flex items-center text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition-colors font-medium shadow hover:shadow-md"
                  >
                    Voir plus de commentaires
                  </button>
                )}
                {visibleCommentsCount > 3 && (
                  <button
                    onClick={handleShowLessComments}
                    className="flex items-center text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-5 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors font-medium shadow hover:shadow-md"
                  >
                    Voir moins de commentaires
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Add Comment */}
          <div className="p-6 md:p-8 bg-white border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 mr-3 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">Ajouter un commentaire</h3>
            </div>

            {(errorcomment || errorcommentuser) && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded">
                {errorcomment || errorcommentuser}
              </div>
            )}

            <form onSubmit={handelSubmitcomment} className="mt-4">
              <textarea
                className="w-full p-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300 min-h-[150px] text-gray-700 resize-none shadow-sm"
                value={formdata.comment}
                onChange={handelChangecomment}
                placeholder="Écrivez votre commentaire ici..."
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg transition duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <FaComment className="mr-2" /> Ajouter un commentaire
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Related News Section */}
        {relationNews && relationNews.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-700 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Articles similaires</h2>
            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {relationNews.map((item) => (
                               <div
                                 key={item.id}
                                 className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                               >
                                 <div className="h-56 overflow-hidden relative">
                                   <img
                                     src={`http://localhost:8000/storage/${item.image}`}
                                     alt={item.title}
                                     className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                                     style={{ objectPosition: "center" }}
                                   />
                                   <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                     {item.category}
                                   </div>
                                 </div>
                                 <div className="p-6">
                                   <div className="text-sm text-red-600 font-medium mb-3">{item.date}</div>
                                   <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{item.title}</h3>
                                   <p className="text-gray-600 mb-5 line-clamp-3">{item.content}</p>
                                   <Link
                                     to={`/news/${item.id}`}
                                     className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold group"
                                   >
                                     LIRE PLUS
                                     <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                   </Link>
                                 </div>
                               </div>
                             ))}
                           </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Confirmer la suppression</h2>
            <p className="mb-6 text-center text-gray-700">Voulez-vous vraiment supprimer ce commentaire ?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center shadow-md hover:shadow-lg"
              >
                <FaTrash className="mr-2" /> Supprimer
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition shadow hover:shadow-md"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default DetailNews
