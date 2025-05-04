import React, { useState } from "react";
import axios from "axios";
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

    instance.post("/register", user)
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm"
            />
            {err.usernameErr && (
              <p className="mt-1 text-sm text-red-600">{err.usernameErr}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm"
            />
            {err.emailErr && (
              <p className="mt-1 text-sm text-red-600">{err.emailErr}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm"
            />
            {err.passwordErr && (
              <p className="mt-1 text-sm text-red-600">{err.passwordErr}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm"
            />
            {err.phoneErr && (
              <p className="mt-1 text-sm text-red-600">{err.phoneErr}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm"
            />
            {err.addressErr && (
              <p className="mt-1 text-sm text-red-600">{err.addressErr}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Register
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">Already have an account? </p>
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
