import React, { useState, useEffect } from "react";

const API_URL = "https://localhost:8000/api";

const Categorie = () => {
  const [categories, setCategories] = useState([]); 
  const [newNom, setNewNom] = useState(""); 
  const [editId, setEditId] = useState(null); 
  const [editNom, setEditNom] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categorie`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des catégories.");
        }

        setCategories(data.data); 
      } catch (err) {
        alert(err.message);
      }
    };

    fetchCategories();
  }, []);

 
  const addCategorie = async () => {
    if (!newNom.trim()) {
      alert("Veuillez entrer un nom de catégorie !");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categorie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: newNom }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout.");
      }

      setCategories([...categories, data.data]); 
      setNewNom("");
    } catch (err) {
      alert(err.message);
    }
  };

  const editCategorie = async () => {
    if (!editNom.trim()) {
      alert("Veuillez entrer un nouveau nom !");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categorie/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: editNom }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la modification.");
      }

      const updatedCategories = categories.map((cat) =>
        cat.id === editId ? { ...cat, nom: editNom } : cat
      );
      setCategories(updatedCategories); 
      setEditId(null);
      setEditNom("");
    } catch (err) {
      alert(err.message);
    }
  };


  const deleteCategorie = async (id) => {
    const confirmDelete = window.confirm("Supprimer cette catégorie ?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${API_URL}/categorie/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression.");
      }
  
      const indexToDelete = categories.findIndex((cat) => cat.id === id);
  
      if (indexToDelete !== -1) {
        const updatedCategories = [...categories]; 
        updatedCategories.splice(indexToDelete, 1); 
        setCategories(updatedCategories);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Catégories</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((categorie) => (
          <div
            key={categorie.id}
            className="bg-gradient-to-br from-blue-200 via-orange-200 to-blue-200 rounded-lg shadow hover:shadow-lg p-4 transition-all transform hover:-translate-y-1 text-center">
            {editId === categorie.id ? (
              <div>
                <input
                  type="text"
                  value={editNom}
                  onChange={(e) => setEditNom(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 mb-2"/>
                <button
                  onClick={editCategorie}
                  className="bg-blue-600 text-white px-3 font-bold py-1 rounded hover:bg-blue-700 mr-2">
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditNom("");
                  }}
                  className="bg-red-600 text-white font-bold px-3 py-1 rounded hover:bg-red-700">
                  Annuler
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{categorie.nom}</h3>
                <button
                  onClick={() => {
                    setEditId(categorie.id);
                    setEditNom(categorie.nom);
                  }}
                  className="bg-orange-500 text-white font-bold px-3 py-1 rounded hover:bg-orange-600 mr-2">
                  Modifier
                </button>
                <button
                  onClick={() => deleteCategorie(categorie.id)}
                  className="bg-red-600 text-white font-bold px-3 py-1 rounded hover:bg-red-700">
                  Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={newNom}
          onChange={(e) => setNewNom(e.target.value)}
          placeholder="Nouvelle catégorie"
          className="border border-gray-300 rounded px-3 py-1 mr-2"/>
        <button
          onClick={addCategorie}
          className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-700">
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default Categorie;
