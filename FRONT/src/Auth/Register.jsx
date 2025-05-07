import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import instance from "../helpers/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
  });

  const [err, setErr] = useState({
    usernameErr: "",
    emailErr: "",
    passwordErr: "",
    phoneErr: "",
    addressErr: "",
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

    // Simple frontend validation
    let isValid = true;
    const newErrors = {
      usernameErr: "",
      emailErr: "",
      passwordErr: "",
      phoneErr: "",
      addressErr: "",
    };

    if (!formData.username.trim()) {
      newErrors.usernameErr = "Username is required.";
      isValid = false;
    }
    if (!formData.email.includes("@")) {
      newErrors.emailErr = "Invalid email address.";
      isValid = false;
    }
    if (formData.password.length < 8) {
      newErrors.passwordErr = "Password must be at least 8 characters.";
      isValid = false;
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.passwordErr = "Passwords do not match.";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phoneErr = "Phone is required.";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.addressErr = "Address is required.";
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
      address: formData.address,
    };

    instance
      .post("/register", user)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration error:", error);
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
    <div className="flex items-center justify-center min-h-screen bg-white py-12 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-red-600 to-red-800"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-full -ml-40 -mb-40"></div>

      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-red-50 rounded-full mb-3">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 rounded-full text-white font-title text-xl">
                HC
              </div>
            </div>
            <h2 className="font-title text-3xl text-gray-800 tracking-wider">
              JOIN HUSA CLUB
            </h2>
            <p className="text-gray-500 font-section text-sm mt-1">
              BECOME A MEMBER
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-section text-gray-600 mb-1"
                >
                  USERNAME
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.username ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.usernameErr && (
                  <p className="mt-1 text-sm text-red-600 font-player">
                    {err.usernameErr}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-section text-gray-600 mb-1"
                >
                  EMAIL
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.email ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.emailErr && (
                  <p className="mt-1 text-sm text-red-600 font-player">
                    {err.emailErr}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.password ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.passwordErr && (
                  <p className="mt-1 text-sm text-red-600 font-player">
                    {err.passwordErr}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-section text-gray-600 mb-1"
                >
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-section text-gray-600 mb-1"
                >
                  PHONE
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.phone ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.phoneErr && (
                  <p className="mt-1 text-sm text-red-600 font-player">
                    {err.phoneErr}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-section text-gray-600 mb-1"
                >
                  ADDRESS
                </label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                    style={{ width: formData.address ? "100%" : "0%" }}
                  ></div>
                </div>
                {err.addressErr && (
                  <p className="mt-1 text-sm text-red-600 font-player">
                    {err.addressErr}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-title tracking-wider text-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                REGISTER
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-100 mt-4">
              <p className="text-sm text-gray-500 font-section">
                ALREADY HAVE AN ACCOUNT?
              </p>
              <Link
                to="/login"
                className="text-sm font-medium text-red-600 hover:text-red-700 font-bold"
              >
                LOGIN
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
