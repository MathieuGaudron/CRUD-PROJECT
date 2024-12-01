import React, { useState } from "react";

const CreateCategory = () => {
  const [nom, setNom] = useState(""); // Nom de la catégorie
  const [responseMessage, setResponseMessage] = useState(""); // Message de réponse

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://127.0.0.1:8000/api/categorie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: nom }), // Données envoyées à l'API
      });

      if (!response.ok) {
        const errorData = await response.json();
        setResponseMessage(
          `Erreur : ${errorData.errors || errorData.error || "Erreur inconnue"}`
        );
      } else {
        const data = await response.json();
        setResponseMessage(`Catégorie créée : ${data.data.nom}`);
      }
    } catch (error) {
      setResponseMessage("Une erreur est survenue lors de la requête.");
    }
  };

  return (
    <div>
      <h2>Créer une Catégorie</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom de la catégorie :</label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom de la catégorie"
          required
        />
        <button type="submit">Créer</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreateCategory;
