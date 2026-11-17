// redux/slices/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    }
  }
});

export const { addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
