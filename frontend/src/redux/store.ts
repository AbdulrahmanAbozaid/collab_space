import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import documentReducer from "./documents/doc";
import documentsReducer from "./documents/recentDocs";
import chatReducer from "./documents/chat";

const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
    documents: documentsReducer,
    chat: chatReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
