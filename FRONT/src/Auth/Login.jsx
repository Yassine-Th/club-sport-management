import React from "react";
import instance from "../helpers/axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setAxiosToken } from "../helpers/axios";
import logo from "../assets/logo.png"

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
    const userData = new FormData(e.target);
    const userInput = {
      emailOrUsername: userData.get("emailOrUsername"),
      password: userData.get("password"),
    };
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

      // Store authentication information
      localStorage.setItem("access_token", JSON.stringify(access_token));
      setAxiosToken(access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Check if there's a previous location in the state
      const locationState = location.state;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        // If there's a previous location, navigate there
        if (locationState && locationState.from) {
          navigate(locationState.from);
        } else {
          // Default to boutique if no previous location
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      setNotFound("Email or Password incorrect");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-red-600 to-red-800"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-full -ml-40 -mb-40"></div>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-red-50 rounded-full mb-3">
              <img src={logo} alt="Logo" className="h-16 w-16 rounded-full" />
            </div>
            <h2 className="font-title text-3xl text-gray-800 tracking-wider">
              HUSA CLUB
            </h2>
            <p className="text-gray-500 font-section text-sm mt-1">
              MEMBER LOGIN
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {notFound && (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-600 font-player text-center">
                  {notFound}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-section text-gray-600 mb-1"
              >
                EMAIL OR USERNAME
              </label>
              <div className="relative">
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                />
                <div
                  className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                  style={{ width: formData.emailOrUsername ? "100%" : "0%" }}
                ></div>
              </div>
              {err.emailUsernameErr && (
                <p className="mt-2 text-sm text-red-600 font-player">
                  {err.emailUsernameErr}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-section text-gray-600 mb-1"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div
                  className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                  style={{ width: formData.password ? "100%" : "0%" }}
                ></div>
              </div>
              {err.passwordErr && (
                <p className="mt-2 text-sm text-red-600 font-player">
                  {err.passwordErr}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-title tracking-wider text-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                LOGIN
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500 font-section">
              DON'T HAVE AN ACCOUNT?{" "}
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 font-bold"
              >
                REGISTER
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-xs">FB</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-xs">TW</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-xs">IG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
