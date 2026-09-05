import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: "all",
  },
  reducers: {
    setExpenses: (state, action) => {
      state.items = action.payload;
    },
    addExpense: (state, action) => {
      state.items.push(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.items.findIndex(
        (exp) => exp.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteExpense: (state, action) => {
      state.items = state.items.filter((exp) => exp.id !== action.payload);
    },
    setCategoryFilter: (state, action) => {
      state.filter = action.payload;
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
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setCategoryFilter,
  setLoading,
  setError,
} = expenseSlice.actions;

export default expenseSlice.reducer;
