import { Box, Grid, Text, Button } from "@chakra-ui/react";
import DocumentCard from "../../components/DocumentCard";

const Documents = () => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Recent Documents
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <DocumentCard
          title="Project Proposal"
          lastUpdated="2 hours ago"
          imageUrl="https://via.placeholder.com/150"
        />
        <DocumentCard
          title="Design Mockups"
          lastUpdated="1 day ago"
          imageUrl="https://via.placeholder.com/150"
        />
        <DocumentCard
          title="Financial Report"
          lastUpdated="3 days ago"
          imageUrl="https://via.placeholder.com/150"
        />
        <DocumentCard
          title="User Feedback"
          lastUpdated="5 days ago"
          imageUrl="https://via.placeholder.com/150"
        />
        {/* Add more DocumentCards as needed */}
      </Grid>
      <Box mt={8}>
        <Button colorScheme="purple">Start New Collaboration</Button>
      </Box>
    </Box>
  );
};

export default Documents;
