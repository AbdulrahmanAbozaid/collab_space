import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
// @ts-ignore
import type { Socket } from "socket.io-client";

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: number;
  system?: boolean;
}

interface ChatPanelProps {
  // @ts-ignore
  socket: Socket | null;
  room: string; // must start with "chat_" (the server checks this)
  username?: string;
  isOpen: boolean;
  onClose: () => void;
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/**
 * Always mounted so messages keep arriving while the panel is closed;
 * only the UI is hidden.
 */
const ChatPanel: React.FC<ChatPanelProps> = ({
  socket,
  room,
  username,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const nextId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !username) return;

    setMessages([]);
    const push = (m: Omit<ChatMessage, "id">) =>
      setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);

    const onMessage = (m: {
      username: string;
      message: string;
      timestamp: number;
    }) => push(m);
    const onJoined = (name: string) =>
      push({
        username: "System",
        message: `${name} joined the chat.`,
        timestamp: Date.now(),
        system: true,
      });
    const onLeft = (name: string) =>
      push({
        username: "System",
        message: `${name} left the chat.`,
        timestamp: Date.now(),
        system: true,
      });

    socket.on("receive-chat-message", onMessage);
    socket.on("user-joined-chat", onJoined);
    socket.on("user-left-chat", onLeft);

    // Join now (if connected) and re-join after any reconnect. Server join is idempotent.
    const join = () => socket.emit("join-chat", room, username);
    if (socket.connected) join();
    socket.on("connect", join);

    return () => {
      socket.emit("leave-chat", room);
      socket.off("receive-chat-message", onMessage);
      socket.off("user-joined-chat", onJoined);
      socket.off("user-left-chat", onLeft);
      socket.off("connect", join);
    };
  }, [socket, room, username]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const send = () => {
    const text = draft.trim();
    if (!text || !socket) return;
    socket.emit("send-chat-message", room, text);
    setDraft("");
  };

  if (!isOpen) return null;

  return (
    <Flex
      direction="column"
      position="fixed"
      right="0"
      top="10px"
      bottom="0"
      width="300px"
      maxH="100vh"
      bg="white"
      boxShadow="lg"
      zIndex={1000}
      borderRadius="md"
    >
      <HStack
        bg="blue.600"
        color="white"
        p={2}
        borderTopRadius="md"
        justifyContent="space-between"
      >
        <Text fontWeight="bold">Chat</Text>
        <IconButton
          aria-label="Close chat"
          size="xs"
          icon={<CloseIcon />}
          onClick={onClose}
        />
      </HStack>

      <Box flex="1" overflowY="auto" bg="gray.50" p={2}>
        {messages.map((m) => (
          <Box
            key={m.id}
            p={2}
            mb={2}
            borderRadius="md"
            bg={
              m.system
                ? "gray.100"
                : m.username === username
                  ? "green.50"
                  : "blue.50"
            }
          >
            <Text fontWeight="bold" fontSize="sm">
              {m.username}
            </Text>
            <Text wordBreak="break-word">{m.message}</Text>
            <Text fontSize="xs" color="gray.500">
              {formatTime(m.timestamp)}
            </Text>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <HStack p={2} spacing={2} bg="gray.50" borderBottomRadius="md">
        <Input
          placeholder="Enter message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send} colorScheme="blue" isDisabled={!socket}>
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatPanel;
