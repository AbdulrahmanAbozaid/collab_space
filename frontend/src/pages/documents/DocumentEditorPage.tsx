import React, { useEffect, useState } from "react";
import { Box, Center, useDisclosure } from "@chakra-ui/react";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";
import DocumentHeader from "../../components/documents/DocumentHeader";
import VoiceCall from "../../components/documents/VoiceCall";
import ChatPanel from "../../components/documents/ChatPanel";
import QuillEditor from "../../components/documents/Editor/QuillEditor";
import { useSocket } from "../../utils/useSocket";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { restoreUser } from "../../redux/auth/Thunks/UserThunk";
import cookies from "../../utils/cookies";

const SOCKET_URL = window.location.origin || import.meta.env.SOCKET_URL;

const DocumentEditorPage: React.FC = () => {
  const username = useAppSelector(
    (state: RootState) => state.auth.user?.username,
  );
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // One socket shared by chat + voice
  const socket = useSocket(SOCKET_URL);

  const {
    isOpen: isChatOpen,
    onToggle: toggleChat,
    onClose: closeChat,
  } = useDisclosure();
  // Off by default: don't ask for the mic the moment someone opens a doc
  const [isCallVisible, setIsCallVisible] = useState(false);

  // Auth / restore user
  useEffect(() => {
    if (!token) {
      if (!cookies.get("clb-tkn")) navigate("/login");
      else dispatch(restoreUser());
    }
  }, [token, navigate, dispatch]);

  if (!id) return <Center minH="100vh">Document not found</Center>;

  return (
    <Box bg="#f9fbfd" minHeight="100vh" p={4}>
      <DocumentHeader
        documentTitle="My Document"
        onToggleCall={() => setIsCallVisible((v) => !v)}
        onToggle={toggleChat}
        username={username || "Anonymous"}
        docId={id}
      />

      <ChatPanel
        socket={socket}
        room={`chat_${id}`}
        username={username}
        isOpen={isChatOpen}
        onClose={closeChat}
      />

      {isCallVisible && username && (
        <VoiceCall
          socket={socket}
          roomId={`voice_${id}`}
          username={username}
          onLeave={() => setIsCallVisible(false)}
        />
      )}

      {username ? (
        <QuillEditor username={username} docId={id} />
      ) : (
        <Center mt={8}>Loading...</Center>
      )}
    </Box>
  );
};

export default DocumentEditorPage;
