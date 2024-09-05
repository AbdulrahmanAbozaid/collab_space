import React from 'react';
import { Box, Text, IconButton, Flex } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';

type Collaborator = {
  name: string;
  status: 'editing' | 'viewing' | 'idle' | string;
};

type DocumentHeaderProps = {
  documentTitle: string;
  collaborators: Collaborator[];
  onToggleCall: () => void; // Ensure this prop is defined
};

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentTitle,
  collaborators,
  onToggleCall,
}) => {
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
      <Text fontSize="xl" fontWeight="bold">
        {documentTitle}
      </Text>
      <Flex alignItems="center">
        {collaborators.map((collab, index) => (
          <Text
            key={index}
            color={collab.status === 'editing' ? 'purple.500' : 'gray.500'}
            mr={4}
            fontSize="sm"
          >
            {collab.name} ({collab.status.charAt(0).toUpperCase() + collab.status.slice(1)})
          </Text>
        ))}
        <IconButton
          aria-label="Toggle Call Interface"
          icon={<PhoneIcon />}
          onClick={onToggleCall}
          colorScheme="purple"
          variant="ghost"
        />
      </Flex>
    </Box>
  );
};

export default DocumentHeader;
