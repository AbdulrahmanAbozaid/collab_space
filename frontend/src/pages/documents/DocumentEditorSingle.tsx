import React, { useEffect, useRef, useState } from "react";
import DocumentHeader from "../../components/documents/DocumentHeader";
import VoiceCallInterface from "../../components/documents/VoiceCall";
import {
  Box,
  Button,
  Text,
  Center,
  HStack,
  Input,
  VStack,
  useDisclosure,
  IconButton,
  useOutsideClick,
} from "@chakra-ui/react";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// Collaboration
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// import { proxy, subscribe, useSnapshot } from "valtio";
import * as awarenessProtocol from "y-protocols/awareness"; // Awareness import
import { QuillBinding } from "y-quill";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import QuillCursors from "quill-cursors";
import { restoreUser } from "../../redux/auth/Thunks/UserThunk";
import cookies from "../../utils/cookies";
// @ts-ignore
import { io, Socket } from "socket.io-client";
import { CloseIcon, MinusIcon } from "@chakra-ui/icons";
Quill.register("modules/cursors", QuillCursors);
const ydocRef = new Y.Doc();
const ytextRef = ydocRef.getText("quill"); // Use YText for text content

const DocumentEditorPage: React.FC = () => {
  const username = useAppSelector(
    (state: RootState) => state.auth.user?.username
  ); // Get username from Redux
  const { token, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isCallVisible, setIsCallVisible] = useState(true);
  const { id } = useParams<{ id: string }>();
  //   const snap = useSnapshot(state);
  const reactQuillRef = useRef(null);
  const quillEditorRef = useRef<any>();
  const providerRef = useRef<WebrtcProvider>();
  const quillBindingRef = useRef<QuillBinding>();
  const socketRef = useRef<Socket>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null); // Reference to the chat box
  // Chat
  const { isOpen, onToggle, onClose } = useDisclosure(); // For minimizing chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const roomName = `test_${id}`,
    chatRoom = `chat_${id}`;
  const modules = {
    toolbar: {
      container: "#toolbar",
    },
    history: {
      maxStack: 500,
      userOnly: true,
    },
    cursors: true,
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "color",
    "background",
    "size", // Add size format
    "direction", // Add text direction format
    "align", // Add alignment format
    "formula", // Add formula format
  ];

  // Retrieving the User
  useEffect(() => {
    if (!token) {
      if (!cookies.get("clb-tkn")) navigate("/login");
      else {
        // Restore user Data
        dispatch(restoreUser());
      }
    }
  }, [token, username]);

  //* Quill Edits
  /*useEffect(() => {
    attachQuillRefs();

    if (!reactQuillRef.current) return;

    try {
      console.log("🚀 ~ useEffect ~ providerRef.current:", providerRef.current);

      providerRef.current = new WebrtcProvider(roomName, ydocRef, {
        signaling: ["ws://localhost:4444"],
      });

      const awareness = new awarenessProtocol.Awareness(ydocRef);
      providerRef.current.awareness = awareness;
      if (!username || !reactQuillRef.current) return;

      // @ts-ignore
      quillEditorRef.current = reactQuillRef.current.getEditor();

      // Bind the Yjs document to the Quill editor, including awareness for cursors
      quillBindingRef.current = new QuillBinding(
        ytextRef,
        quillEditorRef.current,
        awareness
      );
      console.log("🚀 ~ useEffect ~ quillBindingRef:", quillBindingRef);
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }

    return () => {
      try {
        if (quillBindingRef.current) quillBindingRef.current.destroy();
        if (!ydocRef.isDestroyed) ydocRef.destroy();
        if (providerRef.current?.connected) providerRef.current.disconnect();
      } catch (err) {
        console.log("🚀 ~ return ~ err:", err);
      }
    };
  }, [reactQuillRef.current, id]);*/

  /// Handle socket connection

  useEffect(() => {
    // Check and attach Quill editor reference after the component renders
    if (reactQuillRef.current) {
      attachQuillRefs();
    }

    if (!reactQuillRef.current) return;

    try {
      // WebRTC Provider for real-time collaboration
      providerRef.current = new WebrtcProvider(roomName, ydocRef, {
        signaling: ["ws://localhost:4444"],
      });

      const awareness = new awarenessProtocol.Awareness(ydocRef);
      providerRef.current.awareness = awareness;

      // Ensure username and Quill editor are available
      if (!username || !reactQuillRef.current) return;

      // @ts-ignore
      quillEditorRef.current = reactQuillRef.current.getEditor(); // Attach the editor reference

      // Bind the Yjs document to the Quill editor, including awareness for cursors
      quillBindingRef.current = new QuillBinding(
        ytextRef,
        quillEditorRef.current,
        awareness
      );
      console.log("Quill binding successfully established");
    } catch (error) {
      console.log("Error during WebRTC and Quill setup:", error);
    }

    // Cleanup on component unmount
    return () => {
      try {
        if (quillBindingRef.current) quillBindingRef.current.destroy();
        if (!ydocRef.isDestroyed) ydocRef.destroy();
        if (providerRef.current?.connected) providerRef.current.disconnect();
      } catch (err) {
        console.log("Error during cleanup:", err);
      }
    };
  }, [reactQuillRef.current, id]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    socketRef.current.on("receive-chat-message", (chatMessage: any) => {
      console.log("🚀 ~ socketRef.current.on ~ chatMessage:", chatMessage);
      setChatMessages((prevMessages) => {
        if (prevMessages.length <= 0) return [chatMessage];
        const p = prevMessages[prevMessages.length - 1];
        const dub =
          p["username"] == chatMessage["username"] &&
          p["message"] == chatMessage["message"] &&
          p["timestamp"] == chatMessage["timestamp"];
        if (dub) return prevMessages;
        else return [...prevMessages, chatMessage];
      });
    });

    socketRef.current.on("user-joined-chat", (username: string) => {
      console.log("🚀 ~ socketRef.current.on ~ username:", username);
      const msg = {
        username: "System",
        message: `${username} joined the chat.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prevMessages) => {
        if (prevMessages.length <= 0) return [msg];
        const p = prevMessages[prevMessages.length - 1];
        const dub =
          p["username"] == msg["username"] &&
          p["message"] == msg["message"] &&
          p["timestamp"] == msg["timestamp"];
        if (dub) return prevMessages;
        else return [...prevMessages, msg];
      });
    });

    socketRef.current.on("user-left-chat", (username: string) => {
      const msg = {
        username: "System",
        message: `${username} left the chat.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prevMessages) => {
        if (prevMessages.length <= 0) return [msg];
        const p = prevMessages[prevMessages.length - 1];
        const dub =
          p["username"] == msg["username"] &&
          p["message"] == msg["message"] &&
          p["timestamp"] == msg["timestamp"];
        if (dub) return prevMessages;
        else return [...prevMessages, msg];
      });
    });

    socketRef.current.emit("join-chat", chatRoom, username);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive-chat-message");
        socketRef.current.off("user-joined-chat");
        socketRef.current.off("user-left-chat");
      }
    };
  }, [chatRoom, username]);
  // Function to send a chat message
  const sendMessage = React.useCallback(() => {
    if (newMessage.trim() && socketRef.current) {
      const timestamp = new Date().toLocaleTimeString();
      socketRef.current.emit(
        "send-chat-message",
        chatRoom,
        newMessage,
        timestamp
      );
      const msg = { username, message: newMessage, timestamp };

      // Optimistic UI update
      setChatMessages((prevMessages) => {
        if (prevMessages.length <= 0) return [msg];
        const p = prevMessages[prevMessages.length - 1];
        const dub =
          p["username"] == msg["username"] &&
          p["message"] == msg["message"] &&
          p["timestamp"] == msg["timestamp"];
        if (dub) return prevMessages;
        else return [...prevMessages, msg];
      });

      setNewMessage(""); // Clear input
    }
  }, [newMessage, chatRoom, username]);

  const handleChange = (_: any, __: any, source: any, editor: any) => {
    if (source === "user" && ytextRef) {
      const newDelta = editor.getContents();
      ytextRef.applyDelta(newDelta);
    }
  };

  useOutsideClick({
    ref: chatBoxRef, // Attach the ref of the chat box
    handler: onClose, // Close the chat when clicking outside
  });

  const attachQuillRefs = () => {
    //@ts-ignore
    if (typeof reactQuillRef.current?.getEditor !== "function") return;
    //@ts-ignore
    quillEditorRef.current = reactQuillRef.current.getEditor();
  };

  return (
    <Box bg="#f9fbfd" minHeight="100vh" p={4}>
      <DocumentHeader
        documentTitle="My Document"
        onToggleCall={() => setIsCallVisible(!isCallVisible)}
        onToggle={onToggle}
        roomId={chatRoom}
        username={username || "Anonymous"}
      />
      {isOpen && (
        <Box
          ref={chatBoxRef} // Attach the ref to the chat box for outside click detection
          position="fixed"
          right="0" // Align chat to the right of the screen
          top={"10px"}
          bottom={0}
          width="300px"
          //   height={'100%'}
          maxH="100vh"
          bg="white"
          boxShadow="lg"
          zIndex={1000}
          borderRadius="md"
        >
          {/* Chat Header */}
          <HStack
            bg="blue.600"
            p={2}
            maxH={"5%"}
            borderTopRadius="md"
            justifyContent="space-between"
            color="white"
          >
            <Text fontWeight="bold">Chat</Text>
            <HStack>
              {/* <IconButton
                aria-label="Minimize chat"
                size="xs"
                icon={<MinusIcon />}
                onClick={onClose} // Minimize the chat
              /> */}
              <IconButton
                aria-label="Close chat"
                size="xs"
                icon={<CloseIcon />}
                onClick={onClose} // Close the chat
              />
            </HStack>
          </HStack>

          {/* Chat Body */}
          <VStack
            justifyContent={"flex-end"}
            height={"95%"}
            spacing={2}
            px={2}
            py={2}
            bg="gray.50"
            overflowY="auto"
            borderBottomRadius="md"
          >
            <Box width={"100%"} overflowY="auto" maxH="100%">
              {chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  p={2}
                  bg={msg.username === "System" ? "gray.100" : "blue.50"}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">{msg.username}</Text>
                  <Text>{msg.message}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {msg.timestamp}
                  </Text>
                </Box>
              ))}
            </Box>
            <HStack spacing={2}>
              <Input
                placeholder="Enter message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={sendMessage} colorScheme="blue">
                Send
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
      {/* Custom Toolbar */}
      <Box
        id="toolbar"
        bg="#edf2fa"
        borderRadius="2rem"
        my={2}
        p={2}
        w="100%"
        fontWeight={"bold"}
        position={"sticky"}
        top={"5rem"}
        zIndex={10}
        sx={{
          ".ql-toolbar": {
            border: "none !important",
            boxShadow: "none",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          },
          ".ql-toolbar.ql-snow": {
            border: "none !important",
          },
          ".ql-formats": {
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
          },
          ".ql-toolbar button, .ql-toolbar select": {
            fontSize: "1.5rem",
            fontWeight: "bold",
          },
        }}
      >
        {/* Render Toolbar Options */}
        <Box className="ql-toolbar ql-snow">
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote" />
            <button className="ql-code-block" />
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
            <button className="ql-formula" />
          </span>
          <span className="ql-formats">
            <select className="ql-header">
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option value="" />
            </select>
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
          </span>
          <span className="ql-formats">
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
            <button className="ql-direction" value="rtl" />
          </span>
          <span className="ql-formats">
            <select className="ql-size">
              <option value="small">Small</option>
              <option value="">Normal</option>
              <option value="large">Large</option>
              <option value="huge">Huge</option>
            </select>
            <select className="ql-color" />
            <select className="ql-background" />
          </span>
          <span className="ql-formats">
            <button className="ql-clean" />
          </span>
        </Box>
      </Box>

      {/* {isCallVisible && <VoiceCallInterface socketIO={socketRef.current} roomId={roomName} />} */}

      <Center flexDirection="column" px={{ lg: "4rem" }} mt={4}>
        {/* Editor */}
        {!isLoading && ytextRef ? (
          <Box
            bg="white"
            border="1px solid #acacac"
            position="relative"
            w="100%"
          >
            <ReactQuill
              modules={modules}
              ref={reactQuillRef}
              theme="snow"
              value={ytextRef && ytextRef.toString()} // Display YText content
              onChange={handleChange}
              formats={formats}
              className="custom-editor"
            />
          </Box>
        ) : (
          "Loading..."
        )}
      </Center>
    </Box>
  );
};

export default DocumentEditorPage;
