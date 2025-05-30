import React from "react";
import instance from "../helpers/axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setAxiosToken } from "../helpers/axios";
import logo from "../assets/logo.png"; // Assuming this path is correct
import { Facebook, Instagram, Twitter } from "lucide-react"; // Import Lucide icons

const Login = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [notFound, setNotFound] = useState("");
  const [err, setErr] = useState({
    emailUsernameErr: "",
    passwordErr: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = {
      emailOrUsername: formData.emailOrUsername,
      password: formData.password,
    };

    if (!userInput.emailOrUsername || !userInput.password) {
      setNotFound("Veuillez remplir tous les champs.");
      return;
    }
    setNotFound("");

    const email = userInput.emailOrUsername.includes("@")
      ? userInput.emailOrUsername
      : "";
    const username = !userInput.emailOrUsername.includes("@")
      ? userInput.emailOrUsername
      : "";

    try {
      const response = await instance.post("/login", {
        email: email || username,
        password: userInput.password,
      });
      const { access_token, user } = response.data;

      localStorage.setItem("access_token", JSON.stringify(access_token));
      setAxiosToken(access_token);
      localStorage.setItem("user", JSON.stringify(user));

      const locationState = location.state;

      if (user.role === "admin") {
        window.location.href = "/admin/boutique";
      } else {
        if (locationState && locationState.from) {
          navigate(locationState.from);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 422)
      ) {
        setNotFound("Email ou mot de passe incorrect.");
      } else {
        setNotFound("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  // You can wrap these in <a> tags if they should link somewhere
  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook" }, // Replace # with actual links
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-white py-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-red-600 to-red-800"></div>
      <div className="absolute top-0 right-0 w-56 h-56 bg-red-50 rounded-full -mr-28 -mt-28 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-50 rounded-full -ml-36 -mb-36 opacity-70"></div>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>

        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-block p-2 bg-red-50 rounded-full mb-2">
              <img
                src={logo}
                alt="Logo HUSA Club"
                className="h-12 w-12 rounded-full"
              />
            </div>

            <p className="text-gray-600 font-section text-sm">
              CONNEXION MEMBRE
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {notFound && (
              <div className="bg-red-50 p-2.5 rounded-lg">
                <p className="text-xs text-red-600 font-player text-center">
                  {notFound}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-xs font-medium text-gray-800 mb-0.5"
              >
                EMAIL OU NOM D'UTILISATEUR
              </label>
              <div className="relative">
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                />
                <div
                  className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                  style={{ width: formData.emailOrUsername ? "100%" : "0%" }}
                ></div>
              </div>
              {err.emailUsernameErr && (
                <p className="mt-0.5 text-xs text-red-600 font-player">
                  {err.emailUsernameErr}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-800 mb-0.5"
              >
                MOT DE PASSE
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-60 transition-all text-sm"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="pt-1">
              <button
                type="submit"
                className="w-full px-4 py-2.5 text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-title tracking-wider text-base transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
              >
                SE CONNECTER
              </button>
            </div>
          </form>

          <div className="mt-5 pt-3 text-center border-t border-gray-200">
            <p className="text-xs text-gray-600 font-section">
              PAS ENCORE DE COMPTE ?{" "}
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 font-bold hover:underline"
              >
                S'INSCRIRE
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 hover:text-red-700 transition-all"
              >
                <social.Icon size={16} strokeWidth={2} />{" "}
                {/* Adjust size and strokeWidth as needed */}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
