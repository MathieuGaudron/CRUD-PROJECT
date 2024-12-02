import React from "react";

const Categorie = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-gray-600 font-semibold">
        Aucune catégorie disponible.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
        Catégories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((categorie) => (
          <div
            key={categorie.id}
            className="bg-gradient-to-br from-blue-200 via-orange-200 to-blue-200 rounded-lg shadow hover:shadow-lg p-4 transition-all transform hover:-translate-y-1 text-center">
            <h3 className="text-lg font-extrabold text-gray-800 mb-2">
              {categorie.nom}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorie;
