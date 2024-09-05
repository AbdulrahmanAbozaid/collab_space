import { Box, Flex, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel, Text, Button } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Recent Documents</Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {/* Each document card */}
        <GridItem w="100%" bg="gray.100" borderRadius="md" p={4}>
          <Text fontSize="lg">Project Proposal</Text>
          <Text fontSize="sm">Updated 2 hours ago</Text>
        </GridItem>
        {/* More document cards as needed */}
      </Grid>

      <Box mt={8}>
        <Button colorScheme="purple">Start New Collaboration</Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
