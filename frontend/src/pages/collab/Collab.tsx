import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Documents from "./Documents";
import Settings from "./Settings";

const Collab = () => {
  return (
    <Box p={4}>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Documents</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Documents />
          </TabPanel>
          <TabPanel>
            <Settings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Collab;
