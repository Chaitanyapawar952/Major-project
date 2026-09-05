import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {},
    loading: false,
    error: null,
    selectedTripId: null,
  },
  reducers: {
    setMessages: (state, action) => {
      const { tripId, messages } = action.payload;
      state.messages[tripId] = messages;
    },
    addMessage: (state, action) => {
      const { tripId, message } = action.payload;
      if (!state.messages[tripId]) {
        state.messages[tripId] = [];
      }
      state.messages[tripId].push(message);
    },
    deleteMessage: (state, action) => {
      const { tripId, messageId } = action.payload;
      if (state.messages[tripId]) {
        state.messages[tripId] = state.messages[tripId].filter(
          (msg) => msg.id !== messageId
        );
      }
    },
    setSelectedTripId: (state, action) => {
      state.selectedTripId = action.payload;
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
  setMessages,
  addMessage,
  deleteMessage,
  setSelectedTripId,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
