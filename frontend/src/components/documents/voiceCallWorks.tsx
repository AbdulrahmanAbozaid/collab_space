import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Text,
  Flex,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import { FaPhone, FaPhoneSlash, FaMinus, FaTimes } from "react-icons/fa";
import io from "socket.io-client";

// WebRTC configuration with STUN servers
const PEER_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    {
      urls: "stun:stun.stunprotocol.org",
    },
    { urls: "stun:stun1.l.google.com:5349" },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
  ],
};
let CALL_OPTIONS = {
  video: true,
  audio: false,
};

export interface VoiceCallInterfaceProps {
  roomId: string;
}

interface Participant {
  id: string;
  stream: MediaStream;
  videoEnabled: boolean;
}

const VoiceCallInterface: React.FC<VoiceCallInterfaceProps> = ({
  roomId,
}) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const userVideo = useRef<HTMLVideoElement | any>();
  const partnerVideo = useRef<HTMLVideoElement | any>();
  const peerRef = useRef<any>();
  const socketRef = useRef<any>();
  const otherUser = useRef<any>();
  const userStream = useRef<any>();

  // Handlers to minimize and restore the call interface
  const handleMinimize = () => setIsMinimized(true);
  const handleRestore = () => setIsMinimized(false);
  useEffect(() => {
    if (!userVideo.current) {
      console.error("userVideo ref is not set yet.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia(CALL_OPTIONS)
      .then((stream) => {
        console.log("🚀 ~ .then ~ stream:", stream);

        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socketRef.current = io.connect("http://localhost:3000");
        socketRef.current.emit("join room", roomId);

        socketRef.current.on("other user", (userID: string | number) => {
          callUser(userID);
          otherUser.current = userID;
        });

        socketRef.current.on("user joined", (userID: string | number) => {
          otherUser.current = userID;
        });

        socketRef.current.on("offer", handleRecieveCall);

        socketRef.current.on("answer", handleAnswer);

        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
      })
      .catch((err) => {
        console.error("Error on Navigator: ", err);
      });
  }, [userVideo.current, isMinimized, partnerVideo.current]);

  function callUser(userID: string | number) {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track: any) =>
        peerRef.current.addTrack(track, userStream.current)
      );
  }

  function createPeer(userID?: string | number) {
    const peer = new RTCPeerConnection(PEER_CONFIG);

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID?: string | number) {
    peerRef.current
      .createOffer()
      .then((offer: any) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e: any) => console.log(e));
  }

  function handleRecieveCall(incoming: any) {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track: any) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer: any) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }

  function handleAnswer(message: any) {
    const desc = new RTCSessionDescription(message.sdp);
    if (peerRef.current.signalingState === "have-local-offer") {
      peerRef.current
        .setRemoteDescription(desc)
        .catch((e: any) => console.log(e));
    } else {
      console.log("Skipping setRemoteDescription, peer is in wrong state.");
    }
  }

  function handleICECandidateEvent(e: any) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming: any) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current
      .addIceCandidate(candidate)
      .catch((e: any) => console.log(e));
  }

  function handleTrackEvent(e: any) {
    partnerVideo.current.srcObject = e.streams[0];
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
          onClick={handleRestore}
          _hover={{ bg: "purple.600" }}
        >
          <FaPhone color="white" size={24} />
        </Box>
      ) : (
        <Box
          position="fixed"
          bottom="80px"
          right="20px"
          bg="white"
          p={4}
          rounded="md"
          shadow="xl"
          zIndex={1000}
          width="320px"
          height="auto"
          _hover={{ boxShadow: "2xl" }}
        >
          <Flex justifyContent="flex-end">
            <Tooltip label="Minimize Call" aria-label="Minimize Call Tooltip">
              <IconButton
                aria-label="Minimize Call"
                icon={<FaMinus />}
                size="sm"
                mr={2}
                onClick={handleMinimize}
                _hover={{ bg: "gray.200" }}
              />
            </Tooltip>
            <Tooltip label="End Call" aria-label="End Call Tooltip">
              <IconButton
                aria-label="End Call"
                icon={<FaTimes />}
                size="sm"
                colorScheme="red"
                onClick={() => {}}
                _hover={{ bg: "red.600" }}
              />
            </Tooltip>
          </Flex>

          {/* <Box mt={4}>
            {participants.map((participant, index) => (
              <Flex
                key={index}
                alignItems="center"
                mb={3}
                justifyContent="space-between"
              >
                <Flex alignItems="center">
                  <Avatar
                    src={participant.avatarUrl}
                    name={participant.name}
                    size="sm"
                    mr={3}
                  />
                  <Text fontSize="sm">{participant.name}</Text>
                </Flex>
                <Tooltip
                  label={participant.isMuted ? "Unmute" : "Mute"}
                  aria-label="Mute/Unmute Tooltip"
                >
                  <IconButton
                    aria-label={participant.isMuted ? "Unmute" : "Mute"}
                    icon={participant.isMuted ? <FaPhoneSlash /> : <FaPhone />}
                    size="sm"
                    colorScheme={participant.isMuted ? "gray" : "purple"}
                    onClick={() => onMute(participant.name)}
                    _hover={{ bg: "purple.600" }}
                  />
                </Tooltip>
              </Flex>
            ))}
          </Box> */}

          <Stack direction={["column"]} spacing={"24px"}>
            <Box>
              <video autoPlay ref={userVideo}></video>
            </Box>
            <Box>
              <video autoPlay ref={partnerVideo}></video>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
};
export default VoiceCallInterface;
