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
  MenuGroup,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";

const DashHeader = ({ onSidebarOpen }: { onSidebarOpen: () => void }) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have a new message", isRead: false },
    { id: 2, message: "Your document has been approved", isRead: true },
    { id: 3, message: "New collaboration request", isRead: false },
  ]);

  const markAsRead = (id: number | string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout());

    // Redirect to login page
    navigate("/login");
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
      width="100%"
      top="0"
      zIndex={1000}
      position="fixed"
    >
      <IconButton
        icon={<FiMenu />}
        variant="ghost"
        fontSize="xl"
        onClick={onSidebarOpen}
        aria-label="Open Menu"
        display={{ base: "inline-flex", md: "none" }} // Visible only on mobile
      />

      <Box>
        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
          CollabSpace
        </Text>
      </Box>

      <Flex align="center">
        {/* Notifications */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiBell />}
            variant="ghost"
            fontSize="xl"
            mr="4"
          />
          <MenuList maxH="300px" overflowY="auto">
            <MenuGroup title="Notifications">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Stack direction="row" spacing={4} align="center">
                      <Text>{notification.message}</Text>
                      {!notification.isRead && (
                        <Badge colorScheme="red">New</Badge>
                      )}
                    </Stack>
                  </MenuItem>
                ))
              ) : (
                <Text p={4} color="gray.500">
                  No new notifications
                </Text>
              )}
            </MenuGroup>
          </MenuList>
        </Menu>

        {/* User Profile */}
        <Menu>
          <MenuButton as={Box} cursor="pointer">
            <Flex align="center">
              <Avatar
                size="sm"
                name={user?.username}
                src="profile picture"
              />
              <Box ml="3" textAlign="left">
                <Text fontWeight="bold">{user?.username || "User"}</Text>
              </Box>
              <FiChevronDown />
            </Flex>
          </MenuButton>
          <MenuList>
            <NavLink to={"/collab/profile"}>
              <MenuItem>Profile</MenuItem>
            </NavLink>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default DashHeader;
