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
          console.log("Catégories récupérées :", categoriesData.data);
          console.log("Produits récupérés :", produitData.data);
        
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestion des Produits et Catégories</h1>
      <Categorie categories={categories} />
      <Produit produits={produit} />
    </div>
  );
};

export default App;
