import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaMinus, FaPhone, FaTimes } from "react-icons/fa";
// @ts-ignore
import type { Socket } from "socket.io-client";

// Move these to env vars for production
const PEER_HOST = import.meta.env.PEER_HOST;
const PEER_PORT = import.meta.env.PEER_PORT;
const PEER_PATH = import.meta.env.PEER_PATH;

interface Remote {
  peerId: string;
  username: string;
  stream: MediaStream;
}

interface VoiceCallProps {
  roomId: string;
  // @ts-ignore
  socket: Socket | null; // the page's single shared socket
  username: string;
  withVideo?: boolean;
  onLeave: () => void; // parent unmounts us -> effect cleanup tears everything down
}

/**
 * A component that displays a video stream in a tile.
 * @param param0 The props for the component.
 * @returns The rendered component.
 */
const StreamTile: React.FC<{
  stream: MediaStream;
  name: string;
  muted?: boolean;
}> = ({ stream, name, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasVideo, setHasVideo] = useState(stream.getVideoTracks().length > 0);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const update = () => setHasVideo(stream.getVideoTracks().length > 0);
    stream.addEventListener("addtrack", update);
    stream.addEventListener("removetrack", update);
    update();

    // Video is picture only. Setting .muted on the element is more reliable
    // than the React prop.
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
    }
    // Sound comes only from the <audio> element, and never for the local tile
    if (!muted && audioRef.current) {
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch(() => setBlocked(true));
    }
    return () => {
      stream.removeEventListener("addtrack", update);
      stream.removeEventListener("removetrack", update);
    };
  }, [stream, muted]);

  return (
    <Box
      position="relative"
      borderRadius="md"
      overflow="hidden"
      bg="gray.100"
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {!muted && <audio ref={audioRef} autoPlay />}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          borderRadius: 8,
          display: hasVideo ? "block" : "none",
        }}
      />
      {!hasVideo && <Avatar size="lg" name={name} my={4} />}
      <Text fontSize="sm" mt={1}>
        {name}
      </Text>
      {blocked && (
        <Button
          size="xs"
          mt={1}
          colorScheme="purple"
          onClick={() => audioRef.current?.play().then(() => setBlocked(false))}
        >
          Tap to enable sound
        </Button>
      )}
    </Box>
  );
};

/**
 * A component that displays a voice call interface.
 * @param param0 The props for the component.
 * @returns The rendered component.
 */
const VoiceCall: React.FC<VoiceCallProps> = ({
  roomId,
  socket,
  username,
  withVideo = true,
  onLeave,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotes, setRemotes] = useState<Map<string, Remote>>(new Map());
  const [error, setError] = useState<string | null>(null);

  // The main effect that handles the voice call logic
  useEffect(() => {
    if (!socket) return;

    let cancelled = false;
    let peer: Peer | null = null;
    let stream: MediaStream | null = null;
    const calls = new Map<string, MediaConnection>(); // plain Map: no React state mutation

    const removeRemote = (peerId: string) => {
      calls.get(peerId)?.close();
      calls.delete(peerId);
      setRemotes((prev) => {
        if (!prev.has(peerId)) return prev;
        const next = new Map(prev);
        next.delete(peerId);
        return next;
      });
    };

    const registerCall = (call: MediaConnection, name: string) => {
      calls.set(call.peer, call); // call.peer = the REMOTE peer's id
      call.on("stream", (remoteStream) =>
        setRemotes((prev) =>
          new Map(prev).set(call.peer, {
            peerId: call.peer,
            username: name,
            stream: remoteStream,
          }),
        ),
      );
      call.on("close", () => removeRemote(call.peer));
      call.on("error", () => removeRemote(call.peer));
    };

    // Existing members call whoever just joined
    const onNewPeer = ({
      peerId,
      username: name,
    }: {
      peerId: string;
      username: string;
    }) => {
      if (!peer || !stream) return;
      registerCall(peer.call(peerId, stream, { metadata: { username } }), name);
    };
    const onPeerLeft = (peerId: string) => removeRemote(peerId);

    (async () => {
      try {
        // 1) Get media FIRST so we can answer calls the moment we are in the room
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: withVideo,
        });
      } catch (e: any) {
        setError(e?.message || "Could not access microphone/camera");
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      setLocalStream(stream);

      // 2) Register handlers, 3) create peer, 4) only then join the room
      socket.on("new-peer", onNewPeer);
      socket.on("peer-disconnected", onPeerLeft);

      const https = location.protocol === "https:";
      peer = new Peer(undefined as any, {
        // host: PEER_HOST,
        // port: PEER_PORT,
        // path: PEER_PATH,
        host: location.hostname,
        port: location.port ? Number(location.port) : https ? 443 : 80,
        path: "/peerjs",
        secure: https,
      });
      peer.on("call", (call) => {
        call.answer(stream!);
        registerCall(call, call.metadata?.username ?? "Guest");
      });
      peer.on("open", (id) => {
        if (!cancelled) socket.emit("join-room", roomId, id, username);
      });
      peer.on("error", (err) => setError(err.message));
    })();

    return () => {
      cancelled = true;
      socket.emit("leave-room");
      socket.off("new-peer", onNewPeer);
      socket.off("peer-disconnected", onPeerLeft);
      calls.forEach((c) => c.close());
      calls.clear();
      peer?.destroy();
      stream?.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
      setRemotes(new Map());
    };
  }, [socket, roomId, username, withVideo]);

  return (
    <>
      {/* The Minimized Call button: Checking if the call is minimized */}
      {isMinimized && (
        <Tooltip label="Open call">
          <Box
            position="fixed"
            bottom="20px"
            right="20px"
            bg="purple.500"
            rounded="full"
            shadow="lg"
            zIndex={1000}
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="60px"
            height="60px"
            onClick={() => setIsMinimized(false)}
          >
            <FaPhone size="24px" color="white" />
          </Box>
        </Tooltip>
      )}

      {/* The main call interface: Only shown when the call is not minimized */}
      <Box
        display={isMinimized ? "none" : "block"}
        position="fixed"
        bottom="0"
        right="0"
        bg="white"
        p={4}
        borderRadius="md"
        shadow="md"
        zIndex={1000}
        width="400px"
        maxHeight="80vh"
        overflow="auto"
      >
        <Stack spacing={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Call
            </Text>
            <IconButton
              aria-label="Leave call"
              icon={<FaTimes />}
              onClick={onLeave}
            />
          </Flex>

          {/* Error message */}
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}

          {/* The local stream tile */}
          {localStream && (
            <StreamTile
              stream={localStream}
              name={`${username} (you)`}
              muted={true}
            />
          )}

          {/* Remote streams */}
          {remotes.size === 0 && (
            <Text fontSize="sm" color="gray.500">
              No one is in the call
            </Text>
          )}
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            {Array.from(remotes.values()).map((r) => (
              <StreamTile key={r.peerId} stream={r.stream} name={r.username} />
            ))}
          </Grid>

          {/* Minimize button */}
          <Flex justifyContent="center">
            <IconButton
              aria-label="Minimize"
              icon={<FaMinus />}
              onClick={() => setIsMinimized(true)}
            />
          </Flex>
        </Stack>
      </Box>
    </>
  );
};

export default VoiceCall;
