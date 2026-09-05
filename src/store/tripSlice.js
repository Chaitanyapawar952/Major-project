import { createSlice } from "@reduxjs/toolkit";

const tripSlice = createSlice({
  name: "trips",
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedTrip: null,
  },
  reducers: {
    setTrips: (state, action) => {
      state.items = action.payload;
    },
    addTrip: (state, action) => {
      state.items.push(action.payload);
    },
    updateTrip: (state, action) => {
      const index = state.items.findIndex(
        (trip) => trip.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTrip: (state, action) => {
      state.items = state.items.filter((trip) => trip.id !== action.payload);
    },
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
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
  setTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  setSelectedTrip,
  setLoading,
  setError,
} = tripSlice.actions;

export default tripSlice.reducer;
