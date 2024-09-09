import { Box, Grid, Text, Button, VStack, Icon } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import DocumentCard from "../../components/DocumentCard";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Use uuid to generate unique document IDs

const Documents = () => {
  const navigate = useNavigate();

  const handleCreateNewDocument = () => {
    const newDocumentId = uuidv4(); // Generate a unique document ID
    navigate(`/doc/${newDocumentId}`); // Redirect to the document editor with the new ID
  };

  return (
    <Box p={4}>
      {/* Start New Document Section */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Start New Document
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={6} mb={8}>
        <VStack>
          <Button
            colorScheme="purple"
            size="lg"
            rounded="full"
            w={16}
            h={16}
            iconSpacing={0}
            aria-label="Create New Document"
            onClick={handleCreateNewDocument} // Handle click event
          >
            <Icon as={FaPlus} w={6} h={6} />
          </Button>
          <Text fontSize="sm" fontWeight="semibold">
            Blank Document
          </Text>
        </VStack>
      </Grid>

      {/* Recent Documents Section */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Recent Documents
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={6}>
        <DocumentCard
          title="Project Proposal"
          lastUpdated="2 hours ago"
          imageUrl="https://via.placeholder.com/150"
        />
        {/* Add more DocumentCards as needed */}
      </Grid>
    </Box>
  );
};

export default Documents;
