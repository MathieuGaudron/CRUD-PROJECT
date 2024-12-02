import React from "react";

const Produit = ({ produits }) => {
//   console.log("Produits ok ?", produits);

  if (!produits || produits.length === 0) {
    return <p>Aucun produit disponible.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Produits</h2>
      <ul className="list-disc pl-6">
        {produits.map((produit, index) => (
          <li key={produit.id || index} className="text-gray-700">
            <strong>{produit.nom || "Nom non défini"}</strong> -{" "}
            {produit.description || "Pas de description"} -{" "}
            {produit.prix ? `${produit.prix} €` : "Prix non défini"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produit;
