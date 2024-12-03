import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProduits,
  addProduit,
  editProduit,
  deleteProduit,
  setLoading,
  setError,
} from "../redux/slices/produitSlice";

const API_URL = "https://localhost:8000/api";

const Produit = () => {
  const dispatch = useDispatch();

  const produits = useSelector((state) => state.produit.list);
  const loading = useSelector((state) => state.produit.loading);
  const error = useSelector((state) => state.produit.error);

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentProduit, setCurrentProduit] = useState(null);
  const [searchProduit, setSearchProduit] = useState("");
  const [message, setMessage] = useState("");

  const titleRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categorie`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des catégories.");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Erreur :", error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduits = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${API_URL}/produit`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des produits.");
        const data = await response.json();
        dispatch(setProduits(data.data));
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProduits();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/produit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(addProduit(data.data));
        setFormData({ nom: "", description: "", prix: "", categorie_id: "" });
        setMessage("Produit créé avec succès !");
        alert("Produit créé avec succès !");
      } else {
        setMessage("Erreur lors de la création du produit : " + data.error);
        alert("Erreur lors de la création du produit : " + data.error);
      }
    } catch (error) {
      setMessage("Erreur : Impossible de créer le produit.");
      alert("Erreur : Impossible de créer le produit.");
    }
  };

  const handleEditProduit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/produit/${currentProduit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(editProduit({ id: currentProduit.id, data: data.data }));
        setEditMode(false);
        setCurrentProduit(null);
        setMessage("Produit modifié avec succès !");
        alert("Produit modifié avec succès !");
      } else {
        setMessage("Erreur lors de la modification du produit : " + data.error);
        alert("Erreur lors de la modification du produit : " + data.error);
      }
    } catch (error) {
      setMessage("Erreur : Impossible de modifier le produit.");
      alert("Erreur : Impossible de modifier le produit.");
    }
  };

  const handleDeleteProduit = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?"))
      return;
    try {
      const response = await fetch(`${API_URL}/produit/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch(deleteProduit(id));
        setMessage("Produit supprimé avec succès !");
        alert("Produit supprimé avec succès !");
      } else {
        setMessage("Erreur lors de la suppression du produit.");
        alert("Erreur lors de la suppression du produit.");
      }
    } catch (error) {
      setMessage("Erreur : Impossible de supprimer le produit.");
      alert("Erreur : Impossible de supprimer le produit.");
    }
  };

  const handleEditForm = (produit) => {
    setFormData({
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix,
      categorie_id: produit.categorie_id,
    });
    setEditMode(true);
    setCurrentProduit(produit);

    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filtreProduit = produits.filter((produit) => {
    const query = searchProduit.toLowerCase();
    const produitNom = produit.nom?.toLowerCase() || "";
    const produitCategorie = produit.categorie?.toLowerCase() || "";

    return produitNom.includes(query) || produitCategorie.includes(query);
  });

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2
        ref={titleRef}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        {editMode ? "Modifier un Produit" : "Ajouter un Produit"}
      </h2>
      <form className="mb-6" onSubmit={editMode ? handleEditProduit : handleAddProduit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="nom"
            placeholder="Nom du produit"
            value={formData.nom}
            onChange={handleChange}
            className="border rounded-full-lg px-4 py-2"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-full-lg px-4 py-2"
            required
          />
          <input
            type="number"
            name="prix"
            placeholder="Prix (€)"
            value={formData.prix}
            onChange={handleChange}
            className="border rounded-full-lg px-4 py-2"
            required
          />
          <select
            name="categorie_id"
            value={formData.categorie_id}
            onChange={handleChange}
            className="border rounded-full-lg px-4 py-2"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {editMode ? "Modifier Produit" : "Ajouter Produit"}
        </button>
      </form>

      <div className="mb-6 mt-16">
        <input
          type="text"
          placeholder="Rechercher un produit ou une categorie "
          value={searchProduit}
          onChange={(e) => setSearchProduit(e.target.value)}
          className="border rounded-full-lg px-4 py-2 w-full"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-white">
            <th className="border border-gray-200 px-4 py-2 text-sm font-bold text-left">
              Catégorie
            </th>
            <th className="border border-gray-200 px-4 py-2 text-sm font-bold text-left">
              Nom
            </th>
            <th className="border border-gray-200 px-4 py-2 text-sm font-bold text-left">
              Description
            </th>
            <th className="border border-gray-200 px-4 py-2 text-sm font-bold text-left">
              Prix
            </th>
            <th className="border border-gray-200 px-4 py-2 text-sm font-bold text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtreProduit.map((produit) => (
            <tr
              key={produit.id}
              className="hover:bg-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-101"
            >
              <td className="border border-gray-300 px-4 py-2 text-gray-700">
                {produit.categorie || "Non défini"}
              </td>
              <td className="border border-gray-300 px-4 font-bold py-2 text-gray-700">
                {produit.nom}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-gray-600">
                {produit.description}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">
                {produit.prix ? `${produit.prix} €` : "Prix non défini"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-gray-700">
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={() => handleEditForm(produit)}
                    className="bg-orange-500 text-white px-3 py-1 font-bold rounded-full hover:bg-orange-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteProduit(produit.id)}
                    className="bg-red-600 text-white px-3 py-1 font-bold rounded-full hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Produit;
