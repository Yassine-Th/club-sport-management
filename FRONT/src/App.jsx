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
import Header from "./app/User/Header";
import Boutique from "./app/User/Boutique/Boutique";
import ProduitDetail from "./app/User/Boutique/Produit-detail";
import ProduitsList from "./app/Admin/Boutique/Produits/Produits-List";
import ProduitForm from "./app/Admin/Boutique/Produits/produit-form";
import AdProduitDetails from "./app/Admin/Boutique/Produits/AdProduitDetails";
import AdUpdateProduct from "./app/Admin/Boutique/Produits/AdUpdateProduct";


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
              {/* <Route path="*" element={<UnauthorizedPage />} /> */}

              {user_role === "admin" && (
                <>
                  <Route path="/admin" element={<AdLayout></AdLayout>} />
                  <Route path="/admin/boutique/produits" element={<AdLayout> <ProduitsList/> </AdLayout>} />
                  <Route path="/admin/boutique/produits/ajouter" element={<AdLayout> <ProduitForm/> </AdLayout>} />
                  <Route path="/admin/boutique/produits/:id" element={<AdLayout> <AdProduitDetails/> </AdLayout>} />
                  <Route path="/admin/boutique/produits/edit/:id" element={<AdLayout> <AdUpdateProduct/> </AdLayout>} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/*" element={<Login/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/boutique/:id" element={<ProduitDetail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
          )
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
