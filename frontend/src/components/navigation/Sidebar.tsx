import { Box, VStack, Link, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <Box as="nav" width="250px" bg="purple.600" color="white" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          CollabSpace
        </Text>
        <NavLink 
          to="/collab/documents" 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Documents
        </NavLink>
        <NavLink 
          to="/collab/teams" 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Teams
        </NavLink>
        <NavLink 
          to="/collab/projects" 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Projects
        </NavLink>
        <NavLink 
          to="/collab/analytics" 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Analytics
        </NavLink>
        <NavLink 
          to="/collab/settings" 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Settings
        </NavLink>
      </VStack>
    </Box>
  );
};

export default Sidebar;
