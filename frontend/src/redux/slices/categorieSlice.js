import { createSlice } from '@reduxjs/toolkit';

const categorieSlice = createSlice({
  name: 'categorie', 
  initialState: {
    list: [], 
    loading: false, 
    error: null, 
  },
  reducers: {
    setCategories(state, action) {
      state.list = action.payload;
      // console.log("Categories ajoutées au store : ", action.payload); 
    },
    addCategorie(state, action) {
      state.list.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload; 
    },
  },
});

export const { setCategories, addCategorie, setLoading, setError } =
  categorieSlice.actions;
export default categorieSlice.reducer;
