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
import TeamDetail from "./app/Admin/MyClub/Myclub";
import MyclubAdd from "./app/Admin/MyClub/Create";
import MyclubEdit from "./app/Admin/MyClub/edit";
import TrophyForm from "./app/Admin/MyClub/Trophy/Create";
import Trophy from "./app/Admin/MyClub/Trophy/trophy";
import TrophyEdit from "./app/Admin/MyClub/Trophy/edit";
import ProduitDetail from "./app/User/Boutique/Produit-detail";
import ProduitsList from "./app/Admin/Boutique/Produits/Produits-List";
import ProduitForm from "./app/Admin/Boutique/Produits/produit-form";
import AdProduitDetails from "./app/Admin/Boutique/Produits/AdProduitDetails";
import AdUpdateProduct from "./app/Admin/Boutique/Produits/AdUpdateProduct";
import CheckoutPage from "./app/User/Boutique/Checkout";
import Commandes from "./app/User/Boutique/Commandes";
import Orders from "./app/Admin/Boutique/Orders/Orders-list";
import OrderDetail from "./app/Admin/Boutique/Orders/OrderDetail";
import Categories from "./app/Admin/Boutique/Categorie/Categories";
import CategoryEdit from "./app/Admin/Boutique/Categorie/CategoryEdit";
import AdminBoutique from "./app/Admin/Boutique/AdBoutique";
import Produits from "./app/Admin/Boutique/Produits/Produits-List";


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
                  <Route path="/admin/my_club" element={<AdLayout><TeamDetail /></AdLayout>} />
                  <Route path="/admin/create-myclub" element={<AdLayout><MyclubAdd /></AdLayout>} />
                  <Route path="/admin/edit-myclub/:id" element={<AdLayout><MyclubEdit /></AdLayout>} />
                  <Route path="/admin/titres" element={<AdLayout><Trophy /></AdLayout>} />
                  <Route path="/admin/create-titres" element={<AdLayout><TrophyForm /></AdLayout>} />
                  <Route path="/admin/edit-titres/:id" element={<AdLayout><TrophyEdit /></AdLayout>} />
                   <Route
                    path="/admin/boutique/produits/ajouter"
                    element={
                      <AdLayout>
                        {" "}
                        <ProduitForm />{" "}
                      </AdLayout>
                    }
                  />
                  <Route
                    path="/admin/boutique/produits"
                    element={
                      <AdLayout>
                        {" "}
                        <Produits />{" "}
                      </AdLayout>
                    }
                  />
                  <Route
                    path="/admin/boutique/produits/:id"
                    element={
                      <AdLayout>
                        {" "}
                        <AdProduitDetails />{" "}
                      </AdLayout>
                    }
                  />
                  <Route
                    path="/admin/boutique/produits/edit/:id"
                    element={
                      <AdLayout>
                        {" "}
                        <AdUpdateProduct />{" "}
                      </AdLayout>
                    }
                  />
                  <Route path="/admin/boutique" element={<AdLayout> <AdminBoutique/> </AdLayout>} />
                  <Route path="/admin/boutique/orders" element={<AdLayout> <Orders/> </AdLayout>} />
                  <Route path="/admin/boutique/orders/:id" element={<AdLayout> <OrderDetail/> </AdLayout>} />
                  <Route path="/admin/boutique/categories" element={<AdLayout> <Categories/> </AdLayout>} />
                  <Route path="/admin/boutique/categories/:id" element={<AdLayout> <CategoryEdit/> </AdLayout>} />

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
            <Route path="/news" element={<NewsUser />} />
            <Route path="/news/:id" element={<DetailNews />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/boutique/:id" element={<ProduitDetail />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/commandes" element={<Commandes />} />



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
