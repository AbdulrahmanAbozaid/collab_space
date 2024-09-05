import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Documents from "./Documents";
import Teams from "./Teams";
import Settings from "./Settings";

const Collab = () => {
  return (
    <Box p={4}>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Documents</Tab>
          <Tab>Teams</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Documents />
          </TabPanel>
          <TabPanel>
            <Teams />
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
