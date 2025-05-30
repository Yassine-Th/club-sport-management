import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import instance from "../helpers/axios";
import img from "../img/husa.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });

  const [err, setErr] = useState({
    usernameErr: "",
    emailErr: "",
    passwordErr: "",
    phoneErr: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = {
      usernameErr: "",
      emailErr: "",
      passwordErr: "",
      phoneErr: "",
    };

    if (!formData.username.trim()) {
      newErrors.usernameErr = "Le nom d'utilisateur est requis.";
      isValid = false;
    }
    if (!formData.email.includes("@")) {
      newErrors.emailErr = "Adresse e-mail invalide.";
      isValid = false;
    }
    if (formData.password.length < 8) {
      newErrors.passwordErr =
        "Le mot de passe doit contenir au moins 8 caractères.";
      isValid = false;
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.passwordErr = "Les mots de passe ne correspondent pas.";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phoneErr = "Le numéro de téléphone est requis.";
      isValid = false;
    }

    setErr(newErrors);
    if (!isValid) return;

    const user = {
      name: formData.username,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      phone: formData.phone,
    };

    instance
      .post("/register", user)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erreur d'inscription:", error);
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          setErr((prev) => ({
            ...prev,
            ...Object.keys(serverErrors).reduce((acc, key) => {
              acc[`${key}Err`] = serverErrors[key][0];
              return acc;
            }, {}),
          }));
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white py-8 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-red-600 to-red-800"></div>
      <div className="absolute top-0 right-0 w-56 h-56 bg-red-50 rounded-full -mr-28 -mt-28 opacity-70"></div>{" "}
      {/* Added opacity */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-50 rounded-full -ml-36 -mb-36 opacity-70"></div>{" "}
      {/* Added opacity */}
      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>

        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          {" "}
          {/* Updated shadow and border */}
          <div className="text-center mb-4">
            <div className="inline-block p-2 bg-red-50 rounded-full mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 rounded-full text-white font-title text-lg">
                <img
                  src={img}
                  alt="Logo HUSA Club"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h2 className="font-title font-semibold text-2xl text-gray-800 tracking-wider">
              {" "}
              {/* Added font-semibold */}
              REJOINDRE LE CLUB HUSA
            </h2>
            <p className="text-gray-600 font-section text-sm">
              {" "}
              {/* Changed text color */}
              DEVENEZ MEMBRE
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-medium text-gray-800 mb-0.5" /* Changed label color & weight */
                >
                  NOM D'UTILISATEUR
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Votre nom d'utilisateur"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm" /* Updated border and focus */
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.username ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.usernameErr && (
                  <p className="mt-0.5 text-xs text-red-600 font-player">
                    {err.usernameErr}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-800 mb-0.5" /* Changed label color & weight */
                >
                  ADRESSE E-MAIL
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@domaine.com"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm" /* Updated border and focus */
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.email ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.emailErr && (
                  <p className="mt-0.5 text-xs text-red-600 font-player">
                    {err.emailErr}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-800 mb-0.5" /* Changed label color & weight */
                >
                  MOT DE PASSE
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Au moins 8 caractères"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm" /* Updated border and focus */
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.password ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.passwordErr && (
                  <p className="mt-0.5 text-xs text-red-600 font-player">
                    {err.passwordErr}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-xs font-medium text-gray-800 mb-0.5" /* Changed label color & weight */
                >
                  CONFIRMER LE MOT DE PASSE
                </label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Retapez votre mot de passe"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm" /* Updated border and focus */
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{
                      width: formData.password_confirmation ? "100%" : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {" "}
              {/* Adjusted to md:grid-cols-1 if only phone is present, or keep md:grid-cols-2 if address might come back */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-800 mb-0.5" /* Changed label color & weight */
                >
                  TÉLÉPHONE
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Votre numéro de téléphone"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm" /* Updated border and focus */
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.phone ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.phoneErr && (
                  <p className="mt-0.5 text-xs text-red-600 font-player">
                    {err.phoneErr}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full px-4 py-2.5 text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-title tracking-wider text-base transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer" /* Added hover:bg-gradient-to-br and active:scale-95 */
              >
                S'INSCRIRE
              </button>
            </div>

            <div className="text-center pt-3 border-t border-gray-200 mt-3">
              {" "}
              {/* Updated border color */}
              <p className="text-xs text-gray-600 font-section">
                {" "}
                {/* Changed text color */}
                DÉJÀ UN COMPTE ?
              </p>
              <Link
                to="/login"
                className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline font-bold" /* Added hover:underline */
              >
                SE CONNECTER
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
