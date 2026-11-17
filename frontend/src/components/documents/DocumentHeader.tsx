import React, { useState } from "react";
import {
  Image,
  Box,
  Text,
  IconButton,
  Flex,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  useDisclosure,
  useClipboard,
} from "@chakra-ui/react";
import { PhoneIcon, CheckIcon } from "@chakra-ui/icons";
import { FaComments } from "react-icons/fa"; // For the group icon
import { useNavigate } from "react-router-dom";

type DocumentHeaderProps = {
  documentTitle: string;
  onToggleCall: () => void;
  onToggle: () => void;
  username: string;
  docId: string;
};

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentTitle,
  onToggleCall,
  onToggle,
  username,
  docId,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(documentTitle);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareLink = `${window.location.origin}/documents/${docId}/add-collaborator`;
  const { hasCopied, onCopy } = useClipboard(shareLink); // Chakra UI clipboard hook
  const navigate = useNavigate();

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // You can save the edited title to the backend or a state here
    console.log("Title saved:", editedTitle);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      bg="white"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="100"
    >
      <Box display="flex" alignItems="center" gap={1}>
        {/* Logo */}
        {/* TODO: Make the logo clickable and go to the Home  */}
        <Flex
          alignItems="center"
          cursor="pointer"
          _hover={{
            bg: "gray.100",
          }}
          borderRadius="50%"
          onClick={() => navigate("/collab")}
          transition="background-color 0.3s ease-in-out"
          p={2}
        >
          <Image src="/collab.svg" boxSize="42px" alt="CollabSpace Logo" />
        </Flex>
        {/* Editable Title */}
        {isEditingTitle ? (
          <Flex alignItems="center">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
              _hover={{ borderColor: "blue.500" }}
              size="md"
              width="auto"
              mr={2}
            />
            <IconButton
              aria-label="Save Title"
              icon={<CheckIcon />}
              onClick={handleTitleSave}
              colorScheme="green"
              size="sm"
            />
          </Flex>
        ) : (
          <Text
            fontSize="xl"
            fontWeight="bold"
            onClick={handleTitleClick}
            cursor="pointer"
            boxSizing="border-box"
            border=".2px solid transparent"
            p={1}
            pr={3}
            _hover={{
              borderColor: "gray.500",
              borderRadius: "md",
            }}
          >
            {editedTitle}
          </Text>
        )}
      </Box>

      {/* Participants and Call Controls */}
      <Flex alignItems="center">
        {/* Chat Button */}
        <IconButton
          aria-label="Toggle Chat"
          icon={<FaComments />}
          onClick={onToggle}
          colorScheme="black"
          bg={"gray.100"}
          _hover={{
            bg: "gray.300",
          }}
        />
        {/* Call Button */}
        <IconButton
          aria-label="Toggle Call Interface"
          icon={<PhoneIcon />}
          onClick={onToggleCall}
          colorScheme="purple"
          variant="ghost"
          ml={2}
        />
        <Text ml={"2rem"} fontSize="lg" fontWeight={"bold"} color="black">
          {username}
        </Text>

        <Button ml={4} onClick={onOpen} colorScheme="blue">
          Share
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Copy the link below and share it:</Text>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Text fontSize="md" isTruncated>
                {shareLink}
              </Text>
              <Button onClick={onCopy} colorScheme="teal" size="sm" ml={4}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentHeader;
