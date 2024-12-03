import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Categorie from "./composants/Categorie";
import Produit from "./composants/Produit";

const API_URL = "https://localhost:8000/api";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [produit, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch(`${API_URL}/categorie`);
        const produitResponse = await fetch(`${API_URL}/produit`);
        if (!categoriesResponse.ok || !produitResponse.ok) {
          throw new Error("Erreur récupération des données");
        }

        const categoriesData = await categoriesResponse.json();
        const produitData = await produitResponse.json();

        setCategories(categoriesData.data);
        setProduits(produitData.data);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading)
    return <div className="text-center text-lg text-white">Chargement...</div>;
  if (error)
    return <div className="text-red-500 font-bold text-center">{error}</div>;

  return (
    <Provider store={store}>
      <div className="p-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 text-center font-extrabold bg-white inline-block px-6 py-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105">
          <span className="text-blue-500">TEACH</span>{" "}
          <span className="text-orange-400">'R</span>{" "}
          <span className="text-blue-500">TEST TECHNIQUE</span>
        </h1>

        <button
          onClick={openModal}
          className="bg-orange-500 text-white px-4 py-2 text-sm sm:text-base lg:text-lg font-bold rounded-full hover:bg-orange-600 transition-all mb-4"
        >
          <span className="text-xl lg:text-2xl">&rarr;</span> Recruteur, cliquez
          ici avant de commencer ! MERCI{" "}
          <span className="text-xl lg:text-2xl">&larr;</span>
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 flex flex-col items-center rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-center">
                J'aimerais pouvoir continuer mes études. Recrutez-moi
                svp, en plus ça fait 4 mois que je n'ai plus d'argent... :'(
              </h3>
              <img
                src="/assets/hire_me.png"
                alt="recrutez-moi"
                className="mb-4 object-contain max-w-full h-auto"
              />
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
              >
                X
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto">
          <Categorie categories={categories} />
          <div className="mt-6">
            <Produit produits={produit} />
          </div>
        </div>

        <footer className="w-full py-4 mt-8 text-center text-white">
          <p className="font-semibold text-lg sm:text-xl lg:text-2xl">
            MATHIEU GAUDRON
          </p>
        </footer>
      </div>
    </Provider>
  );
};

export default App;
