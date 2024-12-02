import React, { useEffect, useState } from "react";
import Categorie from "./composants/Categorie";
import Produit from "./composants/Produit";

const API_URL = "https://localhost:8000/api";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [produit, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // console.log("Catégories récupérées :", categoriesData.data);
        // console.log("Produits récupérés :", produitData.data);

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500 font-bold">{error}</div>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 text-center font-extrabold bg-white inline-block px-6 py-2 rounded-full shadow-lg">
        <span className="text-blue-500">TEACH</span>{" "}
        <span className="text-orange-400">'R</span>{" "}
        <span className="text-blue-500">TEST TECHNIQUE</span>
      </h1>

      <h2 className="text-lg mb-6 text-center text-white font-thin">
        prenez-moi sa fait 2 mois j'ai plus d'argent :'(
      </h2>
      <Categorie categories={categories} />
      <div className="mt-6">
        <Produit produits={produit} />
      </div>
      <footer className="w-full py-4 mt-8 text-center text-white">
        <p className="font-semibold text-3xl">MATHIEU GAUDRON</p>
      </footer>
    </div>
  );
};

export default App;
