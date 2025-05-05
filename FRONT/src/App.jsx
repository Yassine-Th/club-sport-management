import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import isLoggedIn from "./Auth/CheckLoggedIn";
import Login from "./Auth/Login";
import { getUserRole } from "./helpers/access_token";
import Register from "./Auth/Register";
import AdLayout from "./app/Admin/AdLayout";

function App() {
  const user_role = getUserRole();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    isLoggedIn(setIsAuthorized);
     console.log(user_role);
      
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {isAuthorized ? (
            <>
              {user_role === "admin" && (
                <>
                  <Route path="/admin" element={<AdLayout></AdLayout>} />
                </>
              )}
              {user_role === "journalist" && (
                <>
                  <Route
                    path="/journalist"
                    element={<h1>journalist Page</h1>}
                  />
                </>
              )}
              {user_role === "store_manager" && (
                <>
                  <Route
                    path="/store_manager"
                    element={<h1>Store_manager Page</h1>}
                  />
                </>
              )}
              {user_role === "user" && (
                <>
                  <Route path="/home" element={<h1>user Page</h1>} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />
              <Route path="*" element={<Login />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
