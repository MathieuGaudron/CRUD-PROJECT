import React, { useState, useEffect, useRef } from "react";

const API_URL = "https://localhost:8000/api";

const Produit = () => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentProduit, setCurrentProduit] = useState(null);

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
      try {
        const response = await fetch(`${API_URL}/produit`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des produits.");
        const data = await response.json();
        setProduits(data.data);
      } catch (error) {
        console.error("Erreur :", error.message);
      }
    };
    fetchProduits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addProduit = async (e) => {
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
        setProduits((prev) => [...prev, data.data]);
        setMessage("Produit créé avec succès !");
        alert("Produit créé avec succès !");
        window.location.reload();
      } else {
        setMessage(data.error || "Erreur lors de la création du produit.");
        alert(data.error || "Erreur lors de la création du produit.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Impossible de créer le produit.");
      alert("Impossible de créer le produit.");
    }
  };

  const editProduit = async (e) => {
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
        setProduits((prev) =>
          prev.map((produit) =>
            produit.id === currentProduit.id ? data.data : produit
          )
        );
        setEditMode(false);
        setCurrentProduit(null);
        setMessage("Produit modifié avec succès !");
        alert("Produit modifié avec succès !");
        window.location.reload();
      } else {
        setMessage(data.error || "Erreur lors de la modification du produit.");
        alert(data.error || "Erreur lors de la modification du produit.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Impossible de modifier le produit.");
      alert("Impossible de modifier le produit.");
    }
  };

  const formulaireEdit = (produit) => {
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

  const deleteProduit = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce produit ?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/produit/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setProduits((prevProduits) =>
          prevProduits.filter((produit) => produit.id !== id)
        );
        setMessage("Produit supprimé avec succès !");
        alert("Produit supprimé avec succès !");
        window.location.reload();
      } else {
        setMessage(data.error || "Erreur lors de la suppression du produit.");
        alert(data.error || "Erreur lors de la suppression du produit.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Impossible de supprimer le produit.");
      alert("Impossible de supprimer le produit.");
    }
  };

  return (
    <div className="bg-white rounded-full-lg shadow-lg p-6">
      <h2
        ref={titleRef}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        {editMode ? "Modifier un Produit" : "Ajouter un Produit"}
      </h2>
      <form className="mb-6" onSubmit={editMode ? editProduit : addProduit}>
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

      <table className="table-auto w-full border-collapse border border-gray-300 rounded-full-lg">
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
          {produits.map((produit) => {
            let categorie = produit.categorie || "Non défini";
            let nom = produit.nom || "Nom non défini";
            let description = produit.description || "Pas de description";
            let prix = produit.prix ? `${produit.prix} €` : "Prix non défini";

            return (
              <tr
                key={produit.id}
                className="hover:bg-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-101"
              >
                <td className="border border-gray-300 px-4 py-2  text-gray-700">
                  {categorie}
                </td>
                <td className="border border-gray-300 px-4 font-bold py-2 text-gray-700">
                  {nom}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-600">
                  {description}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">
                  {prix}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => formulaireEdit(produit)}
                      className="bg-orange-500 text-white px-3 py-1 font-bold rounded-full hover:bg-orange-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteProduit(produit.id)}
                      className="bg-red-600 text-white px-3 py-1 font-bold rounded-full  hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Produit;
