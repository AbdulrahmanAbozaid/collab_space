import { VStack, Icon, Button, Text,} from "@chakra-ui/react";
import { FiFileText, FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isMobile, onClose }: { isMobile: boolean; onClose: () => void }) {
  const linkItems = [
    { name: "Documents", icon: FiFileText, path: "/collab" },
    { name: "Settings", icon: FiSettings, path: "/collab/settings" },
  ];

  const handleClick = (_: string) => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <VStack paddingTop={"2rem"} px={"1rem"} align="start" spacing={4} w="15rem">
      {linkItems.map((link) => (
        <NavLink style={{ width: "100%" }} to={link.path} key={link.name} end>
          {({ isActive }) => (
            <Button
              w="full"
              variant="ghost"
              justifyContent="start"
              leftIcon={<Icon as={link.icon} boxSize={6} />}
              bg={isActive ? "gray.100" : "transparent"}
              color={isActive ? "blue.500" : "gray.800"}
              _hover={{ bg: "gray.100" }}
              onClick={() => handleClick(link.path)}
            >
              <Text>{link.name}</Text>
            </Button>
          )}
        </NavLink>
      ))}
    </VStack>
  );
}
