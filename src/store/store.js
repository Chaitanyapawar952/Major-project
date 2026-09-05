import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import tripSlice from "./tripSlice";
import expenseSlice from "./expenseSlice";
import chatSlice from "./chatSlice";
import destinationSlice from "./destinationSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    trips: tripSlice,
    expenses: expenseSlice,
    chat: chatSlice,
    destinations: destinationSlice,
  },
});

export default store;
