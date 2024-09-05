import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../common/DashHeader";

const DashboardLayout = () => {
  return (
    <Flex direction="column" h="100vh">
      {/* Header at the top, taking full width */}
      <Header />
      
      {/* Main content section under the header and sidebar */}
      <Flex flex="1">
        <Sidebar />
        <Box
          flex="1"
          p={4}
          ml={{ base: 0, md: "240px" }} // Start content after sidebar
          mt={"64px"} // Adjust top margin to start after header
          overflowY="auto"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
