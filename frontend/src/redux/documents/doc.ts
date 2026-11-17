// src/redux/slices/documentSessionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// @ts-ignore
import { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import * as awarenessProtocol from "y-protocols/awareness"; // Awareness import
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import axiosInstance from "../../utils/Api";

// Define the state for the document session
interface DocumentSessionState {
  id: string | null;
  title: string;
  content: any; // content managed by Yjs
  collaborators: string[];
  ydoc?: Y.Doc | null;
  ytext?: Y.Text | any | null;
  webrtcProvider?: WebrtcProvider | null;
  //@ts-ignore
  socket: Socket | null;
  peerInstance: Peer | null;
  isLoading?: boolean;
  error?: string | null;
  //   messages: ChatMessage[];
  quillBind?: QuillBinding | null;
}

interface ChatMessage {
  username: any;
  message: string;
  timestamp: string;
}

const initialState: DocumentSessionState = {
  id: null,
  title: "",
  content: null,
  collaborators: [],
  socket: null,
  peerInstance: null,
  isLoading: false,
  error: null,
  quillBind: null,
  //   messages: [],
};

// Async Thunk to create a new document and initialize collaboration session
export const createDocumentThunk = createAsyncThunk(
  "documentSession/createDocument",
  async (title: string, { rejectWithValue }) => {
    try {
      // API call to create a new document
      const response = await axiosInstance.post("/documents", { title });
      console.log("🚀 ~ response:", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async Thunk to fetch an existing document and initialize the session
export const fetchDocumentThunk = createAsyncThunk(
  "documentSession/fetchDocument",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await axiosInstance.get(`/documents/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addCollaboratorThunk = createAsyncThunk(
  "documentSession/addCollaborator",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await axiosInstance.patch(
        `/documents/${id}/collaborate`
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error adding collaborator"
      );
    }
  }
);

const documentSessionSlice = createSlice({
  name: "documentSession",
  initialState,
  reducers: {
    /*setDocumentSession: (
      state,
      action: PayloadAction<Omit<DocumentSessionState, "isLoading" | "error">>
    ) => {
      const {
        id,
        title,
        content,
        collaborators,
        ydoc,
        ytext,
        awareness,
        webrtcProvider,
        socket,
        peerInstance,
      } = action.payload;
      state.id = id;
      state.title = title;
      state.content = content;
      state.ytext = ytext;
      state.awareness = awareness;
      state.collaborators = collaborators;
      state.ydoc = ydoc;
      state.webrtcProvider = webrtcProvider;
      state.socket = socket;
      state.peerInstance = peerInstance;
    },*/
    setDocumentSession(state, action: PayloadAction<DocumentSessionState>) {
      return { ...state, ...action.payload };
    },
    updateContent(state, action: PayloadAction<any>) {
      state.content = action.payload;
    },
    addCollaborator(state, action: PayloadAction<string>) {
      state.collaborators.push(action.payload);
    },
    setPeerInstance(state, action: PayloadAction<Peer>) {
      state.peerInstance = action.payload;
    },
    setSocket(state, action: PayloadAction<any>) {
      state.socket = action.payload;
    },
    // addMessage: (state, action: PayloadAction<ChatMessage>) => {
    // //   state.messages!.push(action.payload);
    // },
    // setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
    // //   state.messages = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDocumentThunk.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        const { _id, title, collaborators, content } = payload.data.document;

        // Initialize Yjs (Ydoc), WebRTCProvider, Socket, and PeerJS
        // const ydoc = new Y.Doc();
        const socket = io("http://localhost:3000");

        // const webrtcProvider = new WebrtcProvider(`document-${_id}`, ydoc, {
        //   signaling: ["ws://localhost:4444"],
        //   //   awareness: new awarenessProtocol.Awareness(ydoc),
        // });
        // webrtcProvider.on("synced", (synced) => {
        //   console.log("synced!", synced);
        // });
        // const ytext = ydoc.getText("quill");
        // webrtcProvider.awareness.on("update", (changes) => {
        //   console.log("Awareness updated:", changes);
        // });
        // ytext.observeDeep(() => {
        //   console.log("ytext updated: ", ytext.toJSON());
        // });
        //@ts-ignore
        const peer = new Peer(undefined, {
          host: "localhost",
          port: 3000,
          path: "/peerjs",
          debug: 2,
        });

        socket.on("connect", () => {
          console.log("Socket Connected: ", socket.id);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from socket.io", socket.id);
        });
        Object.assign(state, {
          id: _id,
          title,
          content,
          collaborators,
          //   ydoc,
          //   ytext,
          //   webrtcProvider,
          socket,
          peerInstance: peer,
          //   messages: [...state.messages],
        });
      })
      .addCase(
        createDocumentThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(fetchDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDocumentThunk.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        const { _id, title, collaborators, content } = payload.data.document;

        // Initialize Yjs (Ydoc), WebRTCProvider, Socket, and PeerJS
        const socket = io("http://localhost:3000");
        //@ts-ignore
        const peer = new Peer(undefined, {
          host: "localhost",
          port: 3000,
          path: "/peerjs",
          debug: 2,
        });

        socket.on("connect", () => {
          console.log("Connected to Socket: ", socket.id);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from socket.io", socket.id);
        });

        Object.assign(state, {
          id: _id,
          title,
          content,
          collaborators,
          socket,
          peerInstance: peer,
          //   messages: [...state.messages],
        });
      })
      .addCase(
        fetchDocumentThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(addCollaboratorThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCollaboratorThunk.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        const { _id, title, collaborators, content } = payload.data.document;

        // Initialize Yjs (Ydoc), WebRTCProvider, Socket, and PeerJS
        const socket = io("http://localhost:3000");
        //@ts-ignore
        const peer = new Peer(undefined, {
          host: "localhost",
          port: 3000,
          path: "/peerjs",
          debug: 2,
        });

        socket.on("connect", () => {
          console.log(socket.id);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from socket.io", socket.id);
        });
        Object.assign(state, {
          id: _id,
          title,
          content,
          collaborators,
          socket,
          peerInstance: peer,
          //   messages: [...state.messages],
        });
      })
      .addCase(
        addCollaboratorThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  setDocumentSession,
  updateContent,
  addCollaborator,
  setPeerInstance,
  setSocket,
  //   addMessage,
  //   setMessages,
} = documentSessionSlice.actions;
export default documentSessionSlice.reducer;
