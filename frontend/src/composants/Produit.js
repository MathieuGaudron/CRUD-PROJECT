import React from "react";

const Produit = ({ produits }) => {
  if (!produits || produits.length === 0) {
    return (
      <p className="text-center text-gray-600 font-semibold">
        Aucun produit disponible.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Liste des Produits
      </h2>
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
          </tr>
        </thead>
        <tbody>
          {produits.map((produit) => {
            let categorie = "Non défini";
            if (produit.categorie) {
              categorie = produit.categorie;
            }

            let nom = "Nom non défini";
            if (produit.nom) {
              nom = produit.nom;
            }

            let description = "Pas de description";
            if (produit.description) {
              description = produit.description;
            }

            let prix = "Prix non défini";
            if (produit.prix) {
              prix = `${produit.prix} €`;
            }

            return (
              <tr
                key={produit.id}
                className="hover:bg-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-101">
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {categorie}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">
                  {nom}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-600">
                  {description}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700 font-semibold">
                  {prix}
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
