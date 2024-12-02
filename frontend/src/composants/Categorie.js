import React from "react";

const Categorie = ({ categories }) => {
//   console.log("Catégories ok ?", categories);

  if (!categories || categories.length === 0) {
    return <p>Aucune catégorie disponible.</p>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">Catégories</h2>
      <ul className="list-disc pl-6">
        {categories.map((categorie, index) => (
          <li key={categorie.id || index} className="text-gray-700">
            {categorie.nom}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categorie;
