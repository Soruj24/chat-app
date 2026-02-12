import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message } from '@/lib/types';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  messages: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      const exists = state.chats.find(c => c.id === action.payload.id);
      if (!exists) {
        state.chats.unshift(action.payload);
      }
    },
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      
      // Check for duplicate message
      const isDuplicate = state.messages[chatId].some(m => m.id === message.id);
      if (isDuplicate) return;

      state.messages[chatId].push(message);
      
      // Update last message in chats list
      const chatIndex = state.chats.findIndex(c => c.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = {
          text: message.text || (message.type === 'image' ? '📷 Photo' : '🎤 Voice message'),
          time: message.timestamp,
          status: message.status,
          senderId: message.senderId
        };

        // Increment unread count if not the active chat
        if (state.activeChatId !== chatId && !message.isMe) {
          state.chats[chatIndex].unreadCount = (state.chats[chatIndex].unreadCount || 0) + 1;
        }
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const chatIndex = state.chats.findIndex(c => c.id === action.payload);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    updateChat: (state, action: PayloadAction<{ chatId: string; updates: Partial<Chat> }>) => {
      const index = state.chats.findIndex(c => c.id === action.payload.chatId);
      if (index !== -1) {
        state.chats[index] = { ...state.chats[index], ...action.payload.updates };
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(c => c.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setChats, 
  addChat,
  setActiveChat, 
  setMessages, 
  addMessage, 
  markAsRead,
  updateChat,
  removeChat,
  setLoading, 
  setError 
} = chatSlice.actions;

export default chatSlice.reducer;
