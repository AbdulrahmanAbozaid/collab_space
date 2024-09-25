import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Tooltip, Text, Avatar, Stack, Grid } from "@chakra-ui/react";
import { FaPhone, FaMinus, FaTimes } from "react-icons/fa";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import socketConn from "../utils/socket";
import Peer from "simple-peer";

interface VideoProps {
  peer: Peer.Instance;
}

interface VoiceCallInterfaceProps {
  roomId: string;
}

interface PeerRef {
  peerID: string;
  peer: Peer.Instance;
}

const Video: React.FC<VideoProps> = ({ peer }) => {
  const userVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on("stream", (stream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
  }, [peer]);

  return <video playsInline autoPlay ref={userVideo} />;
};

const VoiceCallInterface: React.FC<VoiceCallInterfaceProps> = ({ roomId }) => {
  const userVideo = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [participants, setParticipants] = useState<PeerRef[]>([]);
  const socketRef = useRef<any>(socketConn); // Using socket.io connection
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<PeerRef[]>([]);
  const username = useAppSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    // Initialize media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideo.current) userVideo.current.srcObject = stream;
        streamRef.current = stream;
        
        socketRef.current.emit("join room", roomId);

        socketRef.current.on("all users", (users: string[]) => {
          const peers: PeerRef[] = users.map((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            return { peerID: userID, peer };
          });
          peersRef.current = peers;
          setParticipants(peers);
        });

        socketRef.current.on("user joined", (payload: { signal: any; callerID: string }) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          const newPeerRef = { peerID: payload.callerID, peer };
          peersRef.current.push(newPeerRef);
          setParticipants((prev) => [...prev, newPeerRef]);
        });

        socketRef.current.on("receiving returned signal", (payload: { signal: any; id: string }) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (item) item.peer.signal(payload.signal);
        });
      });
  }, [roomId]);

  function createPeer(userToSignal: string, callerID: string, stream: MediaStream): Peer.Instance {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream): Peer.Instance {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <>
      {isMinimized ? (
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          bg="purple.500"
          p={3}
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
          <Tooltip label="Open Call Interface">
            <FaPhone size="24px" color="white" />
          </Tooltip>
        </Box>
      ) : (
        <Box
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
                Call Interface
              </Text>
              <IconButton aria-label="End Call" icon={<FaTimes />} onClick={() => console.log("End Call")} />
            </Flex>
            <Box>
              <video muted ref={userVideo} autoPlay playsInline />
            </Box>
            <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
              {participants.map((participant, i) => (
                <Box key={i} borderRadius="md" overflow="hidden" bg="gray.100" p={2} display="flex" flexDirection="column" alignItems="center" position="relative">
                  <Video peer={participant.peer} />
                  <Flex position="absolute" bottom="10px" left="10px" right="10px" justifyContent="space-between" alignItems="center" bg="rgba(0, 0, 0, 0.5)" p={2} borderRadius="md">
                    <Avatar size="sm" />
                    <Text color="white" ml={2}>
                      {username} {participant.peerID}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Grid>
            <Flex justifyContent="center">
              <IconButton aria-label="Minimize" icon={<FaMinus />} onClick={() => setIsMinimized(true)} />
            </Flex>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default VoiceCallInterface;
