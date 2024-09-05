import {
    Box,
    VStack,
    Icon,
    Button,
    Text,
  } from "@chakra-ui/react";
  import {
    FiHome,
    FiUsers,
    FiFileText,
    FiSettings,
  } from "react-icons/fi";
  import { NavLink } from "react-router-dom";
  
  export default function Sidebar() {
    const linkItems = [
      { name: "Dashboard", icon: FiHome, path: "/collab" },
      { name: "Teams", icon: FiUsers, path: "/collab/teams" },
      { name: "Documents", icon: FiFileText, path: "/collab/documents" },
      { name: "Settings", icon: FiSettings, path: "/collab/settings" },
    ];
  
    return (
      <Box
        as="nav"
        bg="white"
        color="gray.800"
        borderRight="1px"
        borderRightColor="gray.200"
        w={{ base: "full", md: "240px" }}
        pos="fixed"
        top="64px" // Sidebar starts after the header
        h="calc(100vh - 64px)" // Sidebar height is the full height minus header height
        zIndex={10}
        p={5}
      >
        <VStack align="start" spacing={4}>
          {linkItems.map((link) => (
            <NavLink
              to={link.path}
              key={link.name}
              end
            >
              {({ isActive }) => (
                <Button
                  w="full"
                  variant="ghost"
                  justifyContent="start"
                  leftIcon={<Icon as={link.icon} boxSize={6} />}
                  bg={isActive ? "gray.100" : "transparent"}
                  color={isActive ? "blue.500" : "gray.800"}
                  _hover={{ bg: "gray.100" }}
                >
                  <Text>{link.name}</Text>
                </Button>
              )}
            </NavLink>
          ))}
        </VStack>
      </Box>
    );
  }
  