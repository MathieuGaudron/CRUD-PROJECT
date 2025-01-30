import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategories, addCategorie, setLoading, setError } from "../redux/slices/categorieSlice";

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const Categorie = () => {
  const dispatch = useDispatch();

  const { list: categories, loading, error } = useSelector((state) => state.categorie);

  const [newNom, setNewNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNom, setEditNom] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${API_URL}/categorie`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des catégories.");
        }

        dispatch(setCategories(data.data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCategories();
  }, [dispatch]);

  const handleAddCategorie = async () => {
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

      dispatch(addCategorie(data.data));
      setNewNom("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditCategorie = async () => {
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
      dispatch(setCategories(updatedCategories));
      setEditId(null);
      setEditNom("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategorie = async (id) => {
    const confirmDelete = window.confirm("Supprimer cette catégorie ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/categorie/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression.");
      }

      const updatedCategories = categories.filter((cat) => cat.id !== id);
      dispatch(setCategories(updatedCategories));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Catégories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((categorie) => (
          <div
            key={categorie.id}
            className="bg-gradient-to-br from-blue-200 via-orange-200 to-blue-200 rounded-lg shadow hover:shadow-lg p-4 transition-all transform hover:-translate-y-1 text-center"
          >
            {editId === categorie.id ? (
              <div>
                <input
                  type="text"
                  value={editNom}
                  onChange={(e) => setEditNom(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleEditCategorie}
                    className="bg-blue-600 text-white px-3 font-bold py-1 rounded-full hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditNom("");
                    }}
                    className="bg-red-600 text-white font-bold px-3 py-1 rounded hover:bg-red-700"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {categorie.nom}
                </h3>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditId(categorie.id);
                      setEditNom(categorie.nom);
                    }}
                    className="bg-orange-500 text-white font-bold px-3 py-1 rounded-full hover:bg-orange-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteCategorie(categorie.id)}
                    className="bg-red-600 text-white font-bold px-3 py-1 rounded-full hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newNom}
            onChange={(e) => setNewNom(e.target.value)}
            placeholder="Nouvelle catégorie"
            className="border border-gray-300 rounded px-3 py-1 flex-1"
          />
          <button
            onClick={handleAddCategorie}
            className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categorie;
