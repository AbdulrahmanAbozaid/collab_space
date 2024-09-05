import {
    Flex,
    Box,
    Text,
    IconButton,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from "@chakra-ui/react";
  import { FiBell, FiChevronDown } from "react-icons/fi";
  import { useLocation, useNavigate } from "react-router-dom";
  
  const DashHeader = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
  
    const handleButtonClick = () => {
      navigate(buttonPath);
    };
  
    return (
      <Flex
        as="header"
        align="center"
        justify="space-between"
        padding="4"
        bg="white"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        width="100%" // Full width of the window
        top="0"
        zIndex="1000"
        position="fixed" // Fixed at the top
      >
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="teal.500">
            CollabSpace
          </Text>
        </Box>
  
        <Flex align="center">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
            variant="ghost"
            fontSize="xl"
            mr="4"
          />
  
          <Menu>
            <MenuButton as={Box} cursor="pointer">
              <Flex align="center">
                <Avatar size="sm" name="John Doe" src="path_to_avatar_image" />
                <Box ml="3" textAlign="left">
                  <Text fontWeight="bold">John Doe</Text>
                  <Text fontSize="sm" color="gray.600">Admin</Text>
                </Box>
                <FiChevronDown />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    );
  };
  
  export default DashHeader;
  