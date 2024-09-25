import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs"; // PeerJS
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  Text,
  Avatar,
  Stack,
  Grid,
} from "@chakra-ui/react";
import { FaPhone, FaMinus, FaTimes } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
// import axios from "axios";
//@ts-ignore
import { io, Socket } from "socket.io-client";

interface VideoProps {
  peerStream: MediaStream;
}

interface VoiceCallInterfaceProps {
  roomId: string;
  // @ts-ignore
  socketIO: Socket;
}

const Video: React.FC<VideoProps> = ({ peerStream }) => {
  const userVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (userVideo.current) {
      userVideo.current.srcObject = peerStream;
    }
  }, [peerStream]);

  return (
    <video
      playsInline
      autoPlay
      ref={userVideo}
      style={{ border: "1px solid black", width: "100%" }}
    />
  );
};

const VoiceCallInterface: React.FC<VoiceCallInterfaceProps> = ({
  roomId,
  socketIO,
}) => {
  const userVideo = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [participants, setParticipants] = useState<{
    [key: string]: MediaStream;
  }>({});
  const [peers, setpeers] = useState<Set<MediaStream>>(new Set());
  const [peersMap, setPeersMap] = useState<Map<string, MediaStream>>(new Map());
  const [connections, setConnections] = useState<{ [key: string]: any }>({});
  const peerInstance = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // @ts-ignore
  const socketRef = useRef<Socket>(socketIO);
  const username = useAppSelector(
    (state: RootState) => state.auth.user?.username
  );

  useEffect(() => {
    // Initialize PeerJS
    if (!peerInstance.current) {
      peerInstance.current = new Peer(undefined, {
        host: "localhost",
        port: 3000,
        path: "/peerjs",
        debug: 2,
      });

      peerInstance.current.on("open", (peerID) => {
        console.log("Connected to PeerJS server with ID:", peerID);
        // Join room or notify other peers
        joinRoom(roomId, peerID);
      });

      peerInstance.current.on("disconnected", () => {
        console.log("Disconnected from PeerJS server");
      });
    }

    // socket connection
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        console.log("Connected to the server.");
      });

      // Handle disconnection event
      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from the server");
      });
    }

    // debugger;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (userVideo.current) userVideo.current.srcObject = stream;
        streamRef.current = stream;

        // Listen for calls from new peers
        console.log(peerInstance.current);

        peerInstance.current &&
          peerInstance.current.on("call", (call) => {
            console.log(
              "🚀 ~ peerInstance.current.on Answering Call ~ call:",
              call,
              call.metadata
            );
            call.answer(stream); // Answer the call with our stream
            call.on("stream", (peerStream) => {
              // Add their stream to the participants
              setParticipants((p) => ({
                ...p,
                [call.metadata.peerId]: peerStream,
              }));
              setpeers((p) => new Set([...p, peerStream]));
              console.log("🚀 ~ call.on ~ PeersMap:", call.metadata, peersMap);
              setPeersMap((p) =>
                new Map(p).set(call.metadata.peerId, peerStream)
              );
            });
            setConnections((c) => {
              c[call.metadata.peerId] = call;
              return c;
            });
          });

        socketRef.current.on("new-peer", (userId: string) => {
          streamRef.current && connectToNewPeer(userId, streamRef.current);
        });

        socketRef.current.on("peer-disconnected", (peerId: any) => {
          // Remove the peer stream when they disconnect
          if (connections[peerId]) connections[peerId].close();
        });
      });

    return () => {
      //   socketRef.current && socketRef.current.disconnect();
      //   peerInstance.current && peerInstance.current.disconnect();
    };
  }, [roomId]);

  // Function to notify other peers
  const joinRoom = (roomID: string, peerID: string) => {
    socketRef.current.emit("join-room", roomID, peerID);
    console.log(`Attempting to join${roomId}, peer ${peerID}`);
  };

  // Function to call new peers who just joined
  const connectToNewPeer = (peerId: any, stream: MediaStream) => {
    const options = {
      metadata: { peerId },
    };
    const call = peerInstance.current!.call(peerId, stream, options);
    console.log(
      "🚀 ~ connectToNewPeer Stream to User ~ stream:",
      peerId,
      stream
    );
    call.on("stream", (userStream) => {
      setParticipants((p) => ({ ...p, [peerId]: userStream }));
      setpeers((p) => new Set([...p, userStream]));
      console.log(
        `🚀 ~ call.on ~ Before Setting${peerId} PeersMap: `,
        peersMap
      );
      setPeersMap((p) => new Map(p).set(peerId, userStream));
    });

    call.on("close", () => {
      console.log(`Connection closed ${peerId}`);
      setParticipants((p) => {
        delete p[peerId];
        return p;
      });

      console.log(
        `🚀 ~ setPeersMapBefore ${peerId} Deleted ~ PeersMap:`,
        peersMap
      );
      setPeersMap((prev) => {
        const newPeersMap = new Map(prev);
        newPeersMap.delete(peerId);
        return newPeersMap;
      });

      setpeers((p) => {
        let pArr = [...p];
        //@ts-ignore
        p.pArr = pArr.reduceRight((acc, curr) => {
          // remove dups
          if (acc.length === 0) {
            return [curr];
          }
          //@ts-ignore
          if (acc[acc.length - 1].id === curr.id) {
            return acc;
          } else {
            return [...acc, curr];
          }
        }, []);

        return new Set(pArr);
      });
    });

    setConnections((c) => {
      c[peerId] = call;
      return c;
    });
  };

  useEffect(() => {
    console.log("🚀 ~ peers:", peers, participants);
    console.log("🚀 ~ peersMap:", peersMap);
  }, [peers, peersMap, participants]);

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
              <IconButton
                aria-label="End Call"
                icon={<FaTimes />}
                onClick={() => console.log("End Call")}
              />
            </Flex>
            <Box>
              <video
                muted
                ref={userVideo}
                autoPlay
                playsInline
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
            <Grid
              templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
              gap={4}
            >
              {Array.from(peersMap).map(([_, peer], i) => (
                <Box
                  key={i + 1}
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.100"
                  p={2}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  position="relative"
                >
                  <Video peerStream={peer} />
                  <Flex
                    position="absolute"
                    bottom="10px"
                    left="10px"
                    right="10px"
                    justifyContent="space-between"
                    alignItems="center"
                    bg="rgba(0, 0, 0, 0.5)"
                    p={2}
                    borderRadius="md"
                  >
                    <Avatar size="sm" />
                    <Text color="white" ml={2}>
                      {username}
                      {/* <Text fontSize={"smaller"}>{peer[0]}</Text> */}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Grid>
            <Flex justifyContent="center">
              <IconButton
                aria-label="Minimize"
                icon={<FaMinus />}
                onClick={() => setIsMinimized(true)}
              />
            </Flex>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default VoiceCallInterface;
