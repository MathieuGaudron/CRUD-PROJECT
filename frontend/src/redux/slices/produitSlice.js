import { createSlice } from "@reduxjs/toolkit";

const produitSlice = createSlice({
  name: "produit",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  
  reducers: {
    setProduits(state, action) {
      state.list = action.payload;
    },
    addProduit(state, action) {
      state.list.push(action.payload);
    },
    editProduit(state, action) {
      const { id, data } = action.payload;
      const index = state.list.findIndex((produit) => produit.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },
    deleteProduit(state, action) {
      state.list = state.list.filter(
        (produit) => produit.id !== action.payload
      );
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setProduits,
  addProduit,
  editProduit,
  deleteProduit,
  setLoading,
  setError,
} = produitSlice.actions;

export default produitSlice.reducer;
