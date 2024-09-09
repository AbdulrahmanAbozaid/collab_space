import React, { useState } from "react";
import {
  Box,
  Text,
  IconButton,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { PhoneIcon, CheckIcon } from "@chakra-ui/icons";
import { FaUsers } from "react-icons/fa"; // For the group icon

type Collaborator = {
  name: string;
  status: "editing" | "viewing" | "idle" | string;
};

type DocumentHeaderProps = {
  documentTitle: string;
  collaborators: Collaborator[];
  onToggleCall: () => void;
};

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentTitle,
  collaborators,
  onToggleCall,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(documentTitle);

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
      p={4}
      bg="white"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="100"
    >
      {/* Editable Title */}
      {isEditingTitle ? (
        <Flex alignItems="center">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
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
        <Text fontSize="xl" fontWeight="bold" onClick={handleTitleClick} cursor="pointer">
          {editedTitle}
        </Text>
      )}

      {/* Participants and Call Controls */}
      <Flex alignItems="center">
        {/* Participants Group Icon */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Show Participants"
            icon={<FaUsers />}
            colorScheme="purple"
            variant="ghost"
          />
          <MenuList>
            {collaborators.map((collab, index) => (
              <MenuItem key={index}>
                {collab.name} ({collab.status.charAt(0).toUpperCase() + collab.status.slice(1)})
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Call Button */}
        <IconButton
          aria-label="Toggle Call Interface"
          icon={<PhoneIcon />}
          onClick={onToggleCall}
          colorScheme="purple"
          variant="ghost"
          ml={2}
        />
      </Flex>
    </Box>
  );
};

export default DocumentHeader;
