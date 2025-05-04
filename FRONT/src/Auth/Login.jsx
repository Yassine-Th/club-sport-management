import instance from "../helpers/axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAxiosToken } from "../helpers/axios";

const Login = () => {
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

      const { access_token } = response.data;
      localStorage.setItem("access_token", JSON.stringify(access_token));
      setAxiosToken(access_token);
      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.reload();
    } catch (error) {
      console.error(error);
      setNotFound("Email or Password incorrect");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            {notFound && (
              <p className="mt-2 text-sm text-red-600">{notFound}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium text-gray-700"
            >
              Email address or username
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.emailOrUsername}
              onChange={handleChange}
            />
            {err.emailUsernameErr && (
              <p className="mt-2 text-sm text-red-600">
                {err.emailUsernameErr}
              </p>
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
            {err.passwordErr && (
              <p className="mt-2 text-sm text-red-600">{err.passwordErr}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
