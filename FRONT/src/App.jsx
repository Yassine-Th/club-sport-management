import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import isLoggedIn from "./Auth/CheckLoggedIn";
import Login from "./Auth/Login";
import { getUserRole } from "./helpers/access_token";
import Register from "./Auth/Register";
import AdLayout from "./app/Admin/AdLayout";
import UnauthorizedPage from "./layouts/Unauthorized";
import Home from "./app/User/Home";
import News from "./app/Admin/News/News";
import CreateNew from "./app/Admin/News/Create";
import EditNew from "./app/Admin/News/edit";
import Header from "./app/User/Header";
import Boutique from "./app/User/Boutique/Boutique";
import NewsUser from "./app/User/News/News";
import DetailNews from "./app/User/News/Details";
import Players from "./app/Admin/Players/Players";
import PlayerCreate from "./app/Admin/Players/Create";
import EditPlayer from "./app/Admin/Players/edit";

function App() {
  const user_role = getUserRole();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    isLoggedIn(setIsAuthorized);      
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {isAuthorized ? (
            <>
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<UnauthorizedPage />} />

              {user_role === "admin" && (
                <>
                  <Route path="/admin" element={<AdLayout></AdLayout>} />
                  <Route path="/admin/news" element={<AdLayout><News /></AdLayout>} />
                  <Route path="/admin/create-new" element={<AdLayout><CreateNew /></AdLayout>} />
                  <Route path="/admin/edit-new/:id" element={<AdLayout><EditNew /></AdLayout>} />
                  <Route path="/admin/players" element={<AdLayout><Players /></AdLayout>} />
                  <Route path="/admin/create-player" element={<AdLayout><PlayerCreate /></AdLayout>} />
                  <Route path="/admin/edit-player/:id" element={<AdLayout><EditPlayer /></AdLayout>} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/news" element={<NewsUser />} />
            <Route path="/news/:id" element={<DetailNews />} />


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </>
          )
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
