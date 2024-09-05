import React, { useState } from "react";
import { Box, Avatar, IconButton, Text, Flex, Tooltip } from "@chakra-ui/react";
import { FaPhone, FaPhoneSlash, FaMinus, FaTimes } from "react-icons/fa";

// type Participant = {
//   name: string;
//   isMuted: boolean;
//   avatarUrl: string;
// };

export interface VoiceCallInterfaceProps {
  participants: { name: string; isMuted: boolean; avatarUrl: string }[];
  onMute: (name: string) => void;
  onEndCall: () => void;
  onHideCall: () => void; 
}

const VoiceCallInterface: React.FC<VoiceCallInterfaceProps> = ({
  participants,
  onMute,
  onEndCall,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Handlers to minimize and restore the call interface
  const handleMinimize = () => setIsMinimized(true);
  const handleRestore = () => setIsMinimized(false);

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
                onClick={onEndCall}
                _hover={{ bg: "red.600" }} // Hover effect for buttons
              />
            </Tooltip>
          </Flex>

          <Box mt={4}>
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
                    _hover={{ bg: "purple.600" }} // Hover effect for buttons
                  />
                </Tooltip>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default VoiceCallInterface;
