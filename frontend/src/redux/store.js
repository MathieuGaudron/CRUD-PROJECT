import { configureStore } from '@reduxjs/toolkit';
import categorieReducer from './slices/categorieSlice';
import produitReducer from './slices/produitSlice';

const store = configureStore({
  reducer: {
    categorie: categorieReducer,
    produit: produitReducer,
  },
});

export default store;
