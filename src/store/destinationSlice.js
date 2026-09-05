import { createSlice } from "@reduxjs/toolkit";

const destinationSlice = createSlice({
  name: "destinations",
  initialState: {
    items: [],
    loading: false,
    error: null,
    suggestions: [],
    suggestionsLoading: false,
  },
  reducers: {
    setDestinations: (state, action) => {
      state.items = action.payload;
    },
    addDestination: (state, action) => {
      state.items.push(action.payload);
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
      state.suggestionsLoading = false;
    },
    setSuggestionsLoading: (state, action) => {
      state.suggestionsLoading = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDestinations,
  addDestination,
  setSearch,
  setSuggestions,
  setSuggestionsLoading,
  setLoading,
  setError,
} = destinationSlice.actions;

export default destinationSlice.reducer;
